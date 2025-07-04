CREATE DATABASE TaskManagerDB;
GO

USE TaskManagerDB;
GO

-- Tabla de Usuarios
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    PasswordSalt NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'user' 
        CHECK (Role IN ('user', 'admin', 'manager')),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    LastLogin DATETIME,
    IsActive BIT NOT NULL DEFAULT 1
);
GO

-- Tabla de Proyectos
CREATE TABLE Projects (
    ProjectID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    OwnerID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(20) NOT NULL 
        CHECK (Status IN ('active', 'paused', 'completed', 'archived')) 
        DEFAULT 'active',
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Tabla de Tareas
CREATE TABLE Tasks (
    TaskID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Status NVARCHAR(20) NOT NULL 
        CHECK (Status IN ('pending', 'in-progress', 'completed', 'archived')) 
        DEFAULT 'pending',
    Priority NVARCHAR(20) NOT NULL 
        CHECK (Priority IN ('low', 'medium', 'high', 'critical')) 
        DEFAULT 'medium',
    DueDate DATETIME,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME,
    CreatedBy INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    AssignedTo INT FOREIGN KEY REFERENCES Users(UserID),
    ProjectID INT FOREIGN KEY REFERENCES Projects(ProjectID)
);
GO

-- Tabla de Comentarios
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NOT NULL FOREIGN KEY REFERENCES Tasks(TaskID),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    IsEdited BIT NOT NULL DEFAULT 0
);
GO

-- Tabla de Registro de Actividades
CREATE TABLE ActivityLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActionType NVARCHAR(50) NOT NULL,
    EntityType NVARCHAR(50) NOT NULL,
    EntityID INT NOT NULL,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    Details NVARCHAR(MAX)
);
GO

-- Tabla de Adjuntos
CREATE TABLE Attachments (
    AttachmentID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NOT NULL FOREIGN KEY REFERENCES Tasks(TaskID),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(MAX) NOT NULL,
    FileType NVARCHAR(50) NOT NULL,
    FileSize BIGINT NOT NULL,
    UploadedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Tabla de Relación Usuario-Proyecto
CREATE TABLE ProjectMembers (
    ProjectID INT NOT NULL FOREIGN KEY REFERENCES Projects(ProjectID),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Role NVARCHAR(20) NOT NULL DEFAULT 'member' 
        CHECK (Role IN ('member', 'manager')),
    JoinedAt DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (ProjectID, UserID)
);
GO

-- Tabla de Etiquetas
CREATE TABLE Tags (
    TagID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Color CHAR(7) NOT NULL DEFAULT '#6c757d'
);
GO

-- Tabla de Relación Tarea-Etiqueta
CREATE TABLE TaskTags (
    TaskID INT NOT NULL FOREIGN KEY REFERENCES Tasks(TaskID),
    TagID INT NOT NULL FOREIGN KEY REFERENCES Tags(TagID),
    PRIMARY KEY (TaskID, TagID)
);
GO

--Triggers--

CREATE OR ALTER TRIGGER tr_Tasks_ActivityLog
ON Tasks
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ActionType NVARCHAR(50);
    DECLARE @UserId INT;
    
    -- Determinar el tipo de acción
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
        SET @ActionType = 'UPDATE';
    ELSE IF EXISTS (SELECT * FROM inserted)
        SET @ActionType = 'INSERT';
    ELSE
        SET @ActionType = 'DELETE';
    
    -- Obtener el usuario que realiza la acción (usamos el último usuario modificado como ejemplo)
    SET @UserId = ISNULL((SELECT TOP 1 CreatedBy FROM inserted), 
                        (SELECT TOP 1 CreatedBy FROM deleted));
    
    -- Registrar la actividad para operaciones INSERT y UPDATE
    IF @ActionType IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            @ActionType,
            'Task',
            i.TaskID,
            @UserId,
            JSON_QUERY((
                SELECT 
                    i.TaskID AS taskId,
                    i.Title AS title,
                    i.Status AS status,
                    i.Priority AS priority,
                    i.DueDate AS dueDate,
                    i.AssignedTo AS assignedTo,
                    i.ProjectID AS projectId,
                    CASE 
                        WHEN @ActionType = 'UPDATE' THEN 
                            (SELECT 
                                d.Title AS old_title,
                                d.Status AS old_status,
                                d.Priority AS old_priority,
                                d.DueDate AS old_dueDate,
                                d.AssignedTo AS old_assignedTo,
                                d.ProjectID AS old_projectId
                             FROM deleted d WHERE d.TaskID = i.TaskID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                        ELSE NULL
                    END AS oldValues
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM inserted i;
    END
    
    -- Registrar la actividad para operaciones DELETE
    ELSE IF @ActionType = 'DELETE'
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            'DELETE',
            'Task',
            d.TaskID,
            @UserId,
            JSON_QUERY((
                SELECT 
                    d.TaskID AS taskId,
                    d.Title AS title,
                    d.Status AS status,
                    d.Priority AS priority,
                    d.DueDate AS dueDate,
                    d.AssignedTo AS assignedTo,
                    d.ProjectID AS projectId
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM deleted d;
    END
END;
GO

CREATE OR ALTER TRIGGER tr_Projects_ActivityLog
ON Projects
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ActionType NVARCHAR(50);
    DECLARE @UserId INT;
    
    -- Determinar el tipo de acción
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
        SET @ActionType = 'UPDATE';
    ELSE IF EXISTS (SELECT * FROM inserted)
        SET @ActionType = 'INSERT';
    ELSE
        SET @ActionType = 'DELETE';
    
    -- Obtener el usuario que realiza la acción (OwnerID)
    SET @UserId = ISNULL((SELECT TOP 1 OwnerID FROM inserted), 
                        (SELECT TOP 1 OwnerID FROM deleted));
    
    -- Registrar la actividad para operaciones INSERT y UPDATE
    IF @ActionType IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            @ActionType,
            'Project',
            i.ProjectID,
            @UserId,
            JSON_QUERY((
                SELECT 
                    i.ProjectID AS projectId,
                    i.Name AS name,
                    i.Status AS status,
                    i.StartDate AS startDate,
                    i.EndDate AS endDate,
                    CASE 
                        WHEN @ActionType = 'UPDATE' THEN 
                            (SELECT 
                                d.Name AS old_name,
                                d.Status AS old_status,
                                d.StartDate AS old_startDate,
                                d.EndDate AS old_endDate
                             FROM deleted d WHERE d.ProjectID = i.ProjectID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                        ELSE NULL
                    END AS oldValues
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM inserted i;
    END
    
    -- Registrar la actividad para operaciones DELETE
    ELSE IF @ActionType = 'DELETE'
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            'DELETE',
            'Project',
            d.ProjectID,
            @UserId,
            JSON_QUERY((
                SELECT 
                    d.ProjectID AS projectId,
                    d.Name AS name,
                    d.Status AS status,
                    d.StartDate AS startDate,
                    d.EndDate AS endDate
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM deleted d;
    END
END;
GO

CREATE OR ALTER TRIGGER tr_Users_ActivityLog
ON Users
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ActionType NVARCHAR(50);
    
    -- Determinar el tipo de acción
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
        SET @ActionType = 'UPDATE';
    ELSE IF EXISTS (SELECT * FROM inserted)
        SET @ActionType = 'INSERT';
    ELSE
        SET @ActionType = 'DELETE';
    
    -- Registrar la actividad para operaciones INSERT y UPDATE
    IF @ActionType IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            @ActionType,
            'User',
            i.UserID,
            i.UserID, -- El usuario se registra a sí mismo
            JSON_QUERY((
                SELECT 
                    i.UserID AS userId,
                    i.Username AS username,
                    i.Email AS email,
                    i.Role AS role,
                    i.IsActive AS isActive,
                    CASE 
                        WHEN @ActionType = 'UPDATE' THEN 
                            (SELECT 
                                d.Username AS old_username,
                                d.Email AS old_email,
                                d.Role AS old_role,
                                d.IsActive AS old_isActive
                             FROM deleted d WHERE d.UserID = i.UserID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                        ELSE NULL
                    END AS oldValues
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM inserted i;
    END
    
    -- Registrar la actividad para operaciones DELETE
    ELSE IF @ActionType = 'DELETE'
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            'DELETE',
            'User',
            d.UserID,
            d.UserID, -- El usuario se registra a sí mismo
            JSON_QUERY((
                SELECT 
                    d.UserID AS userId,
                    d.Username AS username,
                    d.Email AS email,
                    d.Role AS role
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM deleted d;
    END
END;
GO

CREATE OR ALTER TRIGGER tr_Comments_ActivityLog
ON Comments
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ActionType NVARCHAR(50);
    
    -- Determinar el tipo de acción
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
        SET @ActionType = 'UPDATE';
    ELSE IF EXISTS (SELECT * FROM inserted)
        SET @ActionType = 'INSERT';
    ELSE
        SET @ActionType = 'DELETE';
    
    -- Registrar la actividad para operaciones INSERT y UPDATE
    IF @ActionType IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            @ActionType,
            'Comment',
            i.CommentID,
            i.UserID,
            JSON_QUERY((
                SELECT 
                    i.CommentID AS commentId,
                    i.TaskID AS taskId,
                    SUBSTRING(i.Content, 1, 100) AS contentPreview,
                    i.IsEdited AS isEdited,
                    CASE 
                        WHEN @ActionType = 'UPDATE' THEN 
                            (SELECT 
                                SUBSTRING(d.Content, 1, 100) AS old_contentPreview,
                                d.IsEdited AS old_isEdited
                             FROM deleted d WHERE d.CommentID = i.CommentID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                        ELSE NULL
                    END AS oldValues
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM inserted i;
    END
    
    -- Registrar la actividad para operaciones DELETE
    ELSE IF @ActionType = 'DELETE'
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            'DELETE',
            'Comment',
            d.CommentID,
            d.UserID,
            JSON_QUERY((
                SELECT 
                    d.CommentID AS commentId,
                    d.TaskID AS taskId,
                    SUBSTRING(d.Content, 1, 100) AS contentPreview
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM deleted d;
    END
END;
GO

CREATE OR ALTER TRIGGER tr_ProjectMembers_ActivityLog
ON ProjectMembers
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ActionType NVARCHAR(50);
    
    -- Determinar el tipo de acción
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
        SET @ActionType = 'UPDATE';
    ELSE IF EXISTS (SELECT * FROM inserted)
        SET @ActionType = 'INSERT';
    ELSE
        SET @ActionType = 'DELETE';
    
    -- Registrar la actividad para operaciones INSERT y UPDATE
    IF @ActionType IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            @ActionType,
            'ProjectMember',
            i.ProjectID,
            i.UserID, -- El usuario que realiza la acción es el mismo que se está añadiendo al proyecto
            JSON_QUERY((
                SELECT 
                    i.ProjectID AS projectId,
                    i.UserID AS memberId,
                    i.Role AS role,
                    CASE 
                        WHEN @ActionType = 'UPDATE' THEN 
                            (SELECT 
                                d.Role AS old_role
                             FROM deleted d WHERE d.ProjectID = i.ProjectID AND d.UserID = i.UserID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                        ELSE NULL
                    END AS oldValues
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM inserted i;
    END
    
    -- Registrar la actividad para operaciones DELETE
    ELSE IF @ActionType = 'DELETE'
    BEGIN
        INSERT INTO ActivityLogs (ActionType, EntityType, EntityID, UserID, Details)
        SELECT 
            'DELETE',
            'ProjectMember',
            d.ProjectID,
            d.UserID,
            JSON_QUERY((
                SELECT 
                    d.ProjectID AS projectId,
                    d.UserID AS memberId,
                    d.Role AS role
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ))
        FROM deleted d;
    END
END;
GO
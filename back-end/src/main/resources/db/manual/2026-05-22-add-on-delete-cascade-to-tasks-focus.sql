SET @constraint_name := (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tasks'
      AND COLUMN_NAME = 'id_focus'
      AND REFERENCED_TABLE_NAME = 'focuses'
      AND REFERENCED_COLUMN_NAME = 'id'
    LIMIT 1
);

SET @drop_statement := IF(
    @constraint_name IS NULL,
    'SELECT ''No tasks.id_focus foreign key found''',
    CONCAT('ALTER TABLE tasks DROP FOREIGN KEY `', @constraint_name, '`')
);

PREPARE drop_foreign_key_statement FROM @drop_statement;
EXECUTE drop_foreign_key_statement;
DEALLOCATE PREPARE drop_foreign_key_statement;

ALTER TABLE tasks
    ADD CONSTRAINT fk_tasks_focuses
        FOREIGN KEY (id_focus)
        REFERENCES focuses (id)
        ON DELETE CASCADE;

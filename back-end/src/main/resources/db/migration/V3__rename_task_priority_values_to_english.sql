ALTER TABLE tasks
    DROP CONSTRAINT IF EXISTS ck_tasks_priority;

UPDATE tasks
SET priority = CASE priority
    WHEN 'BAIXA' THEN 'LOW'
    WHEN 'MEDIA' THEN 'MEDIUM'
    WHEN 'ALTA' THEN 'HIGH'
    ELSE priority
END;

ALTER TABLE tasks
    ADD CONSTRAINT ck_tasks_priority
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'));

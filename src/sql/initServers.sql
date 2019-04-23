DELETE FROM servers WHERE 1=1;

INSERT INTO
    servers (name, url, port, access_level)
VALUES
    ('Main', 'main.example.com', 4133, 'ALL'),
    ('Test', 'test.example.com', 1234, 'ADMIN');
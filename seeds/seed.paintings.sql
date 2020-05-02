-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE paintings, cells RESTART IDENTITY CASCADE;

INSERT INTO paintings
    (name,date_created)
VALUES
  ('Painting 1','2016-01-16 12:00:00'),
  ('Painting 2','2016-05-01 15:00:00'),
  ('Painting 3','2017-02-22 12:00:00'),
  ('Painting 4','2017-04-04 08:00:00'),
  ('Painting 5','2017-04-23 15:00:00');


  INSERT INTO cells
  (paintingid, position, color)
  VALUES
  (1, 1, 'red'),
  (1, 2, 'black'),
  (1, 3, 'white'),
  (1, 4, 'blue'),
  (1, 5, 'green'),
  (1, 6, 'yellow'),
  (1, 7, 'green'),
  (1, 8, 'blue'),
  (1, 9, 'green');

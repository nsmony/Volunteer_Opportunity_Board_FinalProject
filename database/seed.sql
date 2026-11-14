-- Volunteer Opportunity Board: sample data (all fictional)
-- Run after schema.sql. Safe to re-run: it clears the tables first.
--
-- Demo accounts (passwords are stored only as bcrypt hashes):
--   demo_alice / alice@example.com / Password123
--   demo_bob   / bob@example.com   / Password123

USE volunteer_board;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE opportunities;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (username, email, password_hash) VALUES
  ('demo_alice', 'alice@example.com', '$2b$10$6IJ7A618jLjUmRj5x.TkreIylacZdpdEHqmIIlTHA48aR2GonM4pS'),
  ('demo_bob',   'bob@example.com',   '$2b$10$WroQHLU0IkrwmhQ30It5VOOcuJNczz61ceHmTjCJT8Aq8iDYbQIQ.');

INSERT INTO categories (name) VALUES
  ('Environment'),  -- id 1
  ('Education'),    -- id 2
  ('Community'),    -- id 3
  ('Health');       -- id 4

-- user_id: 1 = demo_alice, 2 = demo_bob
INSERT INTO opportunities (user_id, category_id, title, description, location, status) VALUES
  (1, 1, 'Riverside Clean-Up Day',
   'Join us to collect litter along the river trail. Gloves, bags and snacks are provided. Wear closed shoes and bring a water bottle.',
   'Maple Grove Park, North Entrance', 'open'),
  (1, 1, 'Community Garden Spring Planting',
   'Help prepare the soil, build compost bins and plant vegetables that will be shared with neighbors. No experience needed.',
   'Greenfield Community Garden', 'open'),
  (2, 1, 'Tree Planting Weekend',
   'We planted 80 young trees along the school road. Thank you to everyone who joined. Watch for our next planting day.',
   'Hillside School Road', 'closed'),
  (2, 1, 'Beach Cleanup and Recycling Sort',
   'Morning cleanup followed by sorting plastic, glass and metal for recycling. Volunteers get a free reusable bag.',
   'Sunset Bay Beach', 'open'),
  (2, 2, 'After-School Homework Helpers',
   'Help primary school students with reading and math for one hour after class. Patience and a friendly attitude matter most.',
   'Oakwood Primary School Library', 'open'),
  (1, 2, 'Reading Buddies at the Library',
   'Read picture books aloud to young children on Saturday mornings and help them choose new books to borrow.',
   'Central Public Library, Kids Room', 'open'),
  (2, 2, 'Computer Basics for Seniors',
   'A short course teaching seniors how to use email, video calls and online safety. This session is now full.',
   'Riverside Community Center, Room 4', 'closed'),
  (1, 3, 'Food Bank Sorting Shift',
   'Sort and pack donated food into family boxes. Shifts last two hours and you can sign up for one or several.',
   'Eastside Food Bank Warehouse', 'open'),
  (2, 3, 'Neighborhood Winter Coat Drive',
   'Collect, sort and hand out warm coats and blankets. We also need helpers to greet visitors and keep lines moving.',
   'St. Mark Community Hall', 'open'),
  (1, 3, 'Community Hall Painting Project',
   'The hall has been repainted by our volunteer team. Thank you to everyone who lent a brush.',
   'Pinecrest Community Hall', 'closed'),
  (2, 4, 'Blood Drive Greeters',
   'Welcome donors, help with check-in forms and offer snacks after donation. A short training is given on the day.',
   'City Health Clinic, Main Lobby', 'open'),
  (1, 4, 'Park Walk Companions',
   'Join a weekly gentle walk with older residents. Walk at their pace, chat and make sure everyone gets home safely.',
   'Lakeview Park, Fountain Gate', 'open');
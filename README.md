Eventfeed
=========

## Short info to start

####Development

1. **Fork this repo** (fork button in the top right corner)
2. `git clone https://github.com/YOUR_GITHUB_ID/eventfeed`
3. Read file - **remote_git.md**
4. `npm install` - install all npm modules and bower components
5. `cp env.dev .env` - setup env variables for your dev
6. `node app.js` - starts app on :80 or :8080 for localhost port


####Documentation

#####Endpoints (communication with MongoDB)

######Events
1. GET - / - get initial website page

2. GET - /feed/events - get all the events from DB as array of JSON objects
3. GET - /feed/events/:id - get event by specified Event_ID as a parameter
4. GET - /feed/events/name/:eventname - get array of events by name (search)
5. GET - /feed/events/user/:id - get all events for specified user
6. GET - /feed/myevents - get all myEvents (logged in user)
7. GET - /feed/events/user/host/:id - get all the event 'userid' is hosting

6. POST - /feed/event - saves new event to DB (provided as JSON object in data)
8. POST - /feed/user/event/:id - register for the event

9. not tested - PUT - /feed/events/:id - updates event by Event_ID as a parameter
10. not tested - PUT - /feed/user/:id - updates user info by User_ID as a parameter
11. not tested - PUT - /feed/user/event/:id - updates event for specified user (User_ID as a parameter), event ID provided inside data

12. not tested - DELETE - /feed/events/:id - deletes event by Event_ID as a parameter
13. not tested - DELETE - /feed/user/:id - deletes user by User_ID as a parameter
14. not tested - DELETE - /feed/user/event/:id - deletes event for specified user (User_ID as a paramter), event ID provided inside data

15. to be cntd...

######Users
1. GET - /feed/users/:username - get user by username
2. POST - /feed/user/ - save user new info (from user profile)
3. not tested - PUT - /feed/user/:id - update user info by username
4.

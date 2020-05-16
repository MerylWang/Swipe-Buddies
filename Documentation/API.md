### Route: /users

 * Create user using MIT openID API.
 * @name GET/users/authorized_create
 
 ___

 * Sign in user using MIT openID API
 * @name GET/users/authorized_signin
 
 ___
 
 * Adds new user to database (after authorized_create)
 * @name POST/users
 * @param {string} role - giver or receiver 
 * @throws {409} - if username already exists

___
 
* Create user (without openID)
 * @name POST/users/create
 * @param {string} username - username of new user
 * @param {string} password - password of new user
 * @param {string} role - giver or receiver 
 * @throws {409} - if username already exists

 ___

* User log in (without openID)
 * @name POST/users/signin
 * @param {string} username - this.user.username
 * @param {string} password - this.user.password
 * @throws {404} - user not found
 * @throws {401} - incorrect password

  ___

 * User log out. 
 * @name POST/users/signout
 * @return {json} - signout message
 
 ___

 * Update user reputation. 
 * @name POST/users/reputation
 * @param {string} role - determines which type of reputation to update
 * @param {string} delta - score to be added to user's reputation 
 * @throws {401} - if user not logged in 
 
 ___

 * Get (another) user's reputation. 
 * @name GET/users/reputation/:username 
 * @param {string} username - username of queried user 
 * @throws {404} - if queried user does not exist
 * @throws {401} - if this.user not logged in
 
 ___

 * Change user role. 
 * @name PUT/users/role
 * @param {string} newRole - user's new role ("giver", "receiver")
 * @throws {401} - if user not logged in
 
 ___

 * Check if user is signed in.
 * @name GET/users/session
 
 ___

 * Delete user. 
 * @name DELETE/users
 * @throws {401} - if user not signed in
 
 ___

 * Get whether user is signed in. 
 * @name GET/users/signin
 * @return {Boolean} - true if user is signed in. Else false. 

 ___

 * Change user's reputation. 
 * @name POST/users/reputation/:username/:role
 * @param {string} username - username of queried user 
 * @param {string} role - role of queried user at the time of the match they are reported
 * @throws {404} - if queried user does not exist
 * @throws {401} - if this.user not logged in
 
 ___
 
 ### Route: /events

 * Create an event. 
 * @name POST/events
 * @param {String} day - "year-month-day"
 * @param {object} event_data - {dorm1: [time1, time2], dorm2:[time1, time2], ...}
 * @param {String} meal - breakfast, lunch, dinner
 * @throws {401} - if user is not signed in
 
 ___

 * Edit time given meal at location.
 * @name PUT/events/availability
 * @param {String} day - day of selected event
 * @param {String} meal - meal of selected event
 * @param {String} location - location of selected event
 * @param {object} newTimes - list of strings
 * @throws {401} - if user is not signed in
 * @throws {404} - if event does not exist.
 
 ___

 * Edit meal (location & times). 
 * @name PUT/events/location
 * @param {list} location - new locations 
 * @param {String} day - day of event
 * @param {String} meal - meal of event
 * @param {object} newEvent - new event_data
 * @throws {401} - if user is not signed in
 * @throws {404} - if event does not exist.
 
 ___

 * Delete all meal events for a date. 
 * @name DELETE/events/:day 
 * @param {String} day - date of selected event
 * @throws {401} - if user not signed in
 
 ___

 * Delete a meal on a day.
 * @name DELETE/events/:day/:meal
 * @param {String} day - day of selected event
 * @param {String} meal - meal to delete 
 * @throws {401} - if user not signed in 
 
 ___

 * Get all events (meals) on day for user. 
 * @name GET/events/:day
 * @param {String} day - queried day 
 * @param {String} username - queried user 
 * @throws {401} - user not logged in 
 
 ___

 ### Route: /matches

* Get matches for a user.
* @name GET/matches/user/:username

___

 * Get matches for day. 
 * @name GET/matches/day/:day 

___

 * Delete a match at day, meal. 
 * @name DELETE/matches/:day/:meal
 * @param {String} day - day of match
 * @param {String} meal - meal of match

___

* Change reported flag iof a match
 * @name PUT/matches/report/:day/:meal
 * @param {String} day - day of match
 * @param {String} meal - meal of match

 ___

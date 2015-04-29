# streamy-rooms: Add rooms support to [Streamy](https://github.com/YuukanOO/streamy).

## Installation

Simply add it to your project with:

```console
meteor add yuukan:streamy-rooms
```

## Rooms

Once installed, you have access to `Streamy.Rooms`. It let you sends messages to specific rooms. Rooms are stored in a Mongo collection named `streamy_rooms` and is available through `Streamy.Rooms.model`.

A room record is described as follow:

```json
{
  "_id": "mongo id",
  "name": "The room name",
  "session_ids": [
    "Every connected",
    "session IDs"
  ]
}
```

You can control the behaviour of the room feature by overriding this methods on the server:

```javascript
// Wether or not an user can join a room
Streamy.Rooms.allowJoin = function(data, from) {
  // from is the socket object
  // data contains raw data you can access:
  //  - the room name via data.name
  //  - the message via data.__msg
  //  - the message data via data.__data

  return true;
};

// Wether or not an user can leave a room
Streamy.Rooms.allowLeave = function(data, from) {
  // from is the socket object
  // data contains raw data you can access:
  //  - the room name via data.name
  //  - the message via data.__msg
  //  - the message data via data.__data

  return true;
};

// Called when a user wants to send a message in this room
Streamy.Rooms.allowMessage = function() {
  // from is the socket object
  // data contains raw data you can access:
  //  - the room name via data.__in
  //  - the message via data.__msg
  //  - the message data via data.__data

  // Check if the user appears in this room, this is the default implementation
  return Streamy.Rooms.model.find({ 
    'name': data.__in, 
    'session_ids': from.id
  }).count() > 0;
}
```

By default, when a user join or leave a room, the server will send notifications (`__join__` and `__leave__` messages) to sessions in the same room. You can override the below methods:

```javascript
Streamy.Rooms.onJoin = function(room_name, socket) {
  Streamy.rooms(room_name).emit('__join__', {
    'sid': socket.id,
    'room': room_name
  });
};

Streamy.Rooms.onLeave = function(room_name, socket) {
  Streamy.rooms(room_name).emit('__leave__', {
    'sid': socket.id,
    'room': room_name
  });
};
```

The collection is not published so you'll have to do it yourself, check the [example](https://github.com/YuukanOO/streamy/tree/master/examples/chat) if you don't know where to start.

### Streamy.join(room_name)

Join the given room. This call will created the room if needed and add the session id to the room record.

### Streamy.leave(room_name)

Leave the given room. Remove the session id from the room record.

### Streamy.rooms([room_name])

Used like `Streamy.sessions`, if no argument is provided, it will returns the collection cursor containing all rooms. If you give a name, it will returns an object which contains an `emit` method which works the same as the `core#emit` method.

Please note that in order for this method to work, you should have successfuly joined this room via `Streamy.join` first.

```javascript
Streamy.rooms('my_room').emit('my_message', {});
```

### Streamy.Rooms.clearEmpty

Clear all empty rooms. This method is called when a client leave a room to ensure some sanity of the database.

### Streamy.Rooms.allForSession(sid)

Retrieve all rooms for the given session id.
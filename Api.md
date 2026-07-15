## REST API

- POST /api/auth/register - {username, email, password}
- POST /api/auth/login - {email, password} {token , user}
- GET /api/rooms - قائمة الغرف
- POST /api/rooms (Auth) - {name, descriptaion? , isPrivate}
- POST /api/rooms/dm (Auth) -{receiverId}


## Socket.io (الاتصال مع التوكين)

- join-room - {roomId} => السيرفر هيرد joined-room {roomId}
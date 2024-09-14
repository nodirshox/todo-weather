db.createUser({
  user: 'task',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'task',
    },
  ],
});

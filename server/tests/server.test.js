const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toBe(res.body.errors);
      })
      .end((err) => {
        if (err)
          return done(err);

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  })
});

describe('GET /todos', () => {
  it('should fetch all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  })
});

describe('GET /todos/:id', () => {
  it ('should fetch respective todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toBeTruthy();
      })
      .end(done);
  })

  it ('should not fetch todo created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.todo).toBeFalsy();
      })
      .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID is not valid');
      })
      .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('should delete respective todo', (done) => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((err, res) => {
        if(err) return done(err);

        Todo.findById(todos[1]._id).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  })

  it('should not delete todo created by other user', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) return done(err);

        Todo.findById(todos[1]._id).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  })

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID is not found');
      })
      .end(done);
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID is not valid');
      })
      .end(done);
  })
});

describe('PATCH /todos/:id', () => {
  it ('should update respective todo', (done) => {
    let text = 'Test PATCH'
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
          expect(typeof res.body.todo.completedAt).toBe('string');
          expect(res.body.todo.completed).toBeTruthy();
          expect(res.body.todo.text).toBe(text);
      })
      .end(done);
  })

  it ('should not update todo created by other user', (done) => {
    let text = 'Test PATCH'
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(404)
      .expect((res) => {
          expect(res.body.error).toBeTruthy();
      })
      .end(done);
  })

  it ('should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(todos[1])
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBeFalsy();
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  })
});

describe('GET /users/me', () => {
  it ('should return user if authenticate', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  })

  it ('should return a 401 if not authenticate', (done) => {
    request(app)
      .get('/users/me')
      // .set('x-auth', 'dwafaw')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@dummy.com';
    let password = '123abcde';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end((err) => {
        if (err) return done(err);

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.email).toBe(email);
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  })

  it('should return validation errors if request invalid', (done) => {
    let email = 'exampledummy.com';
    let password = '123abcde';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  })

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send(users[0])
      .expect(400)
      .end(done);
  })
});

describe('POST /users/login' , () => {
  it ('should login user and return auth token' , (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  })

  it ('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: 'dwqfwq'})
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toEqual(1);
          done();
        }).catch((e) => done(e));
      });
  })
});

describe('DELETE /users/me/token', () => {
  it ('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toEqual(0);
          done();
        }).catch((e) => done(e));
      });
  })

  it ('should reject request and return 401 if not authenticate', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token +'1')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toEqual(1);
          done();
        }).catch((e) => done(e));
      })
  })
});

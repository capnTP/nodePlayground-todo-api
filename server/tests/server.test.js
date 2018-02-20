const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First dummy'
}, {
  _id: new ObjectID(),
  text: 'Second dummy',
  completedAt: '123464'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

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
})

describe('GET /todos', () => {
  it('should fetch all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /todos/:id', () => {
  it ('should fetch respective todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toBeTruthy();
      })
      .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
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

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID is not found');
      })
      .end(done);
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123')
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
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.completedAt).toBeTruthy();
          expect(res.body.todo.completed).toBeTruthy();
          expect(res.body.todo.text).toBe(text);
      })
      .end(done);
  })

  it ('should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send(todos[1])
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBeFalsy();
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  })

  it ('should return 404 if todo not found', (done) => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  })

  it ('should return 404 for non-ObjectID', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID is not valid');
      })
      .end(done);
  })
});

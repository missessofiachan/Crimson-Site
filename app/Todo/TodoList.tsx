'use client';
import { useEffect, useState } from 'react';
import styles from './TodoList.module.css';

interface Todo {
  _id?: string;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos
  useEffect(() => {
    fetch('/api/todo')
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch todos');
        return res.json();
      })
      .then(setTodos)
      .catch(err => setError(err.message));
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add todo');
      const { insertedId } = await res.json();
      setTodos([...todos, { _id: insertedId, text: input }]);
      setInput('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async (id: string, newText: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, text: newText })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update todo');
      setTodos(todos.map(t => t._id === id ? { ...t, text: newText } : t));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete todo');
      setTodos(todos.filter(t => t._id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['todo-container']}>
      <h2>Todo List</h2>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles['todo-input-row']}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new todo"
          className={styles['todo-input']}
          onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
          disabled={loading}
          aria-label="Add a new todo"
        />
        <button onClick={addTodo} disabled={loading || !input.trim()}>Add</button>
      </div>
      <ul className={styles['todo-list']}>
        {todos.map(todo => (
          <li key={todo._id} className={styles['todo-item']}>
            <input
              type="text"
              value={todo.text}
              onChange={e => updateTodo(todo._id!, e.target.value)}
              className={styles['todo-edit-input']}
              disabled={loading}
              aria-label="Edit todo"
              placeholder="Edit todo"
            />
            <button onClick={() => deleteTodo(todo._id!)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

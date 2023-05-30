
import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { updateDoc, getDoc, doc } from 'firebase/firestore';
import Firebase from '../components/Firebase';
import { FaSpinner } from 'react-icons/fa';


type Todo = {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: firebase.firestore.Timestamp; // Assuming `createdAt` is of type Timestamp in Firestore
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState('');
  const [editTodoText, setEditTodoText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [filter, setFilter] = useState('');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [counter, setCounter] = useState(1);

  // create, edit & filter function
  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setFilter(inputValue);

    if (isEditMode) {
      setEditTodoText(inputValue);
      setFilter('');
    } else {
      setNewTodo(inputValue);

      if (inputValue) {
        const filteredList = todos.filter((todo) =>
          todo.todo.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredTodos(filteredList);
      } else {
        setFilteredTodos([]);
      }
    }
  };

  // press enter key handler
  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (loading) {
        return;
      }

      setLoading(true);
      setInputDisabled(true);

      try {
        if (editTodoId) {
          await saveEditedTodo();
          setFilter('');
        } else {
          await addTodo();
          setFilter('');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
        setInputDisabled(false);
      }
    }
  };

  // create using firebase
  const addTodo = async () => {
    if (newTodo.trim()) {
      const isDuplicate = todos.some(
        (todo) => todo.todo.toLowerCase() === newTodo.toLowerCase()
      );
      if (isDuplicate) {
        alert('Task already exists!');
        return;
      }

      const todosRef = firebase.firestore().collection('todos');
      const todo: Todo = {
        task_id: counter,
        todo: newTodo,
        isCompleted: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      try {
        setCounter((prevCounter) => prevCounter + 1);
        await todosRef.add(todo);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
    setFilteredTodos([]);
  };

  // remove task function
  const removeTodo = (id:string) => {
    const todosRef = firebase.firestore().collection('todos');
    todosRef
      .doc(id)
      .delete()
      .then(() => {
        // Update the todos state by filtering out the removed todo
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error('Error removing todo:', error);
      });
  };

  // edit task function
  const editTodo = (id: string, todoText: string) => {
    setEditTodoId(id);
    setEditTodoText(todoText);
    setIsEditMode(true);
  };

  // update task function
  const saveEditedTodo = async () => {
    if (editTodoText.trim()) {
      const isDuplicate = todos.some(
        (todo) =>
          todo.id !== editTodoId && todo.todo.toLowerCase() === editTodoText.toLowerCase()
      );

      if (isDuplicate) {
        alert('Duplicate todo value!');
        return;
      }

      const todoDocRef = doc(firebase.firestore(), 'todos', editTodoId);

      try {
        await updateDoc(todoDocRef, { todo: editTodoText });
        cancelEdit();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  // cancel update
  const cancelEdit = () => {
    setEditTodoId('');
    setEditTodoText('');
    setIsEditMode(false);
  };

  // toggle completed and incompleted
  const toggleComplete = async (id: string) => {
    const todoDocRef = doc(firebase.firestore(), 'todos', id);

    try {
      const todoDocSnapshot = await getDoc(todoDocRef);
      const isCompleted = todoDocSnapshot.data()?.isCompleted;

      await updateDoc(todoDocRef, { isCompleted: !isCompleted });
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  useEffect(() => {
    // Fetch todos from Firestore
    const fetchTodos = () => {
      const todosRef = firebase.firestore().collection('todos');
      todosRef
        .orderBy('createdAt', 'asc')
        .onSnapshot((snapshot) => {
          const todosData: Todo[] = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((todo) => todo.createdAt !== null && todo.createdAt !== undefined);
  
          setTodos(todosData);
          setIsLoading(false);
        });
    };
  
    fetchTodos();
  }, []);
  

  return (
    <div className="main">
      <Firebase />
      <h1>Todo List</h1>
      {/* input field */}
      <input
        type="text"
        value={isEditMode ? editTodoText : newTodo}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={isEditMode ? 'Edit the task and press Enter' : 'Type a new task and press Enter'}
      />
      {isLoading ? (
        <FaSpinner className="spin" />
      ):
      (
        <>
          <h1>Task List</h1>
          <ul>
            {/* filtering  */}
            { filter ? 
              (
                <>
                {/* if empty */}
                  {filteredTodos.length === 0 ? (
                    <p>No result. Create a new one instead!</p>
                  ) : (
                    <>
                      {/* display filter if matching */}
                      {filteredTodos.map((todo) => (
                        <li className="task" key={todo.id}>
                          <span style={{textDecoration: todo.isCompleted ? 'line-through' : 'none'}}>
                            {todo.todo}
                          </span>
                          <button className="btn1" onClick={() => removeTodo(todo.id)}>
                            Remove
                          </button>
                          <button className="btn2" onClick={() => editTodo(todo.id, todo.todo)}>
                            Edit
                          </button>
                          <button className="btn3" onClick={() => toggleComplete(todo.id)}>
                            {todo.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </button>
                        </li>
                      ))}
                    </>
                  )}
                </>
              ) : 
              (
                <>
                {/* defualt showing task list */}
                  {todos.map((todo) => (
                    <li className="task" key={todo.id}>
                      <span style={{textDecoration: todo.isCompleted ? 'line-through' : 'none'}}>
                        {todo.todo}
                      </span>
                      {isEditMode && editTodoId === todo.id ? 
                      (
                        <>
                          <button onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : 
                      (
                        <>
                          <button className="btn1" onClick={() => removeTodo(todo.id)}>
                            Remove
                          </button>
                          <button className="btn2" onClick={() => editTodo(todo.id, todo.todo)}>
                            Edit
                          </button>
                          <button className="btn3" onClick={() => toggleComplete(todo.id)}>
                            {todo.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </>
              )
            }
          </ul>
        </>
      )}
    </div>
  );
}

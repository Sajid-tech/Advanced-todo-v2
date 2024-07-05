"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";


export const Context = createContext()


const AppContext = ({ Children }) => {
    const { data: session } = useSession()


    const [getTodo, setGetTodo] = useState([])
    const [completed, setCompleted] = useState([]);
    const [inCompleted, setInCompleted] = useState([]);
    const [totalTodos, setTotalTodos] = useState(0);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchTodos = async () => {
        try {
            const res = await axios.get('/api/todos')
            setGetTodo(res.data)
            const completedTodos = getTodo.filter((todo) => todo.isCompleted)
            const inCompletedTodos = getTodo.filter((todo) => !todo.isCompleted)
            setCompleted(completedTodos) //get completed todos
            setTotalTodos(completedTodos.length) // get completed todos lenegth
            setInCompleted(inCompletedTodos)  // get incompleted todos
        } catch (error) {
            console.error("Error fetching in todos: ", error)
        }
    }

    useEffect(() => {
        fetchTodos();

    }, [fetchTodos]);









    return (
        <Context.Provider value={{ completed, inCompleted, totalTodos }}>

            {Children}
        </Context.Provider>
    )
}

export default AppContext
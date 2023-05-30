import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import TodoList from '../components/TodoList.tsx'


export default function Home() {
  return (
    <div>
     <TodoList />
    </div>
  )
}

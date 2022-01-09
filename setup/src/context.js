import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';

const table = {
   sports: 21,
   history: 23,
   politics: 24,
};

const API_ENDPOINT = 'https://opentdb.com/api.php?';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
   //@@@@@@@@@@@@@@@@@ context vars @@@@@@@@@@@@@@@@@//
   // el waiting es mientras se muestra la form
   const [waiting, setWaiting] = useState(true);
   const [loading, setLoading] = useState(false);
   const [questions, setQuestions] = useState([]);
   const [index, setIndex] = useState(0);
   const [correct, setCorrect] = useState(0);
   const [error, setError] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [quiz, setQuiz] = useState({
      amount: 10,
      category: 'sports',
      difficulty: 'easy',
   }); /* form default, los mismos nombres (key) q se ocupan en la url */

   //@@@@@@@@@@@@@@@@@ fetch @@@@@@@@@@@@@@@@@//
   const fetchQuestions = async url => {
      setLoading(true);
      setWaiting(false);

      const response = await axios(url).catch(err => {
         console.log(err);
      });

      if (response) {
         const data = response.data.results;

         if (data.length > 0) {
            setQuestions(data);
            setLoading(false);
            setWaiting(false);
            setError(false);
         } else {
            // cuando no tiene preguntas ni respuestas q mandar => manda "[ ]"
            setWaiting(true);
            setError(true);
         }
      } else {
         setWaiting(true);
      }
   };

   //@@@@@@@@@@@@@@@@@ next question @@@@@@@@@@@@@@@@@//
   const nextQuestion = () => {
      setIndex(oldIndex => {
         const index = oldIndex + 1;

         if (index > questions.length - 1) {
            openModal();

            return 0;
         } else {
            return index;
         }
      });
   };

   //@@@@@@@@@@@@@@@@@ check answer @@@@@@@@@@@@@@@@@//
   const checkAnswer = value => {
      if (value) {
         setCorrect(oldState => oldState + 1);
      }
      nextQuestion();
   };

   //@@@@@@@@@@@@@@@@@ open modal @@@@@@@@@@@@@@@@@//
   const openModal = () => {
      setIsModalOpen(true);
   };

   //@@@@@@@@@@@@@@@@@ close modal @@@@@@@@@@@@@@@@@//
   const closeModal = () => {
      setWaiting(true);
      setCorrect(0);
      setIsModalOpen(false);
   };

   //@@@@@@@@@@@@@@@@@ para la form @@@@@@@@@@@@@@@@@//
   const handleChange = e => {
      const name = e.target.name;
      const value = e.target.value;

      setQuiz({ ...quiz, [name]: value });
   };

   const handleSubmit = e => {
      e.preventDefault();
      const { amount, category, difficulty } = quiz;

      const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;

      fetchQuestions(url);
   };

   return (
      <AppContext.Provider
         value={{
            waiting,
            loading,
            questions,
            index,
            correct,
            error,
            isModalOpen,
            nextQuestion,
            checkAnswer,
            closeModal,
            quiz,
            handleChange,
            handleSubmit,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

//@@@@@@@@@@@@@@@@@ context @@@@@@@@@@@@@@@@@//
export const useGlobalContext = () => {
   return useContext(AppContext);
};

export { AppContext, AppProvider };

/*
ejemplo
https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple


{
   response_code: 0,
   results: [
      {
         category: 'Sports',
         type: 'multiple',
         difficulty: 'easy',
         question:
            'Which of the following sports is not part of the triathlon?',
         correct_answer: 'Horse-Riding',
         incorrect_answers: ['Cycling', 'Swimming', 'Running'],
      },
      {
         ... x 9
      },
   ],
};

==============================
==============================

cuando la API no manda resultados ( de preguntas y resp ) a una peticion ( se va a tomar error en el mandado ), lo q manda es

response_code: 1,
results: [ ]

*/

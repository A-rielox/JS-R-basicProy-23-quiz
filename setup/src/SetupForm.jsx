import React from 'react';
import { useGlobalContext } from './context';

const SetupForm = () => {
   const { quiz, handleChange, handleSubmit, error } = useGlobalContext();

   return (
      <main>
         <section className="quiz quiz-small">
            <form className="setup-form">
               <h2>setup quiz</h2>
               {/* amount */}
               <div className="form-control">
                  <label htmlFor="amount">number of questions</label>
                  {/* el "name" tiene q ser amount */}
                  <input
                     type="number"
                     name="amount"
                     id="amount"
                     value={quiz.amount}
                     onChange={handleChange}
                     className="form-input"
                     min={1}
                     max={50}
                  />
               </div>

               {/* category, el name tiene q ser "category" */}
               <div className="form-control">
                  <label htmlFor="category">category</label>
                  <select
                     name="category"
                     id="category"
                     className="form-input"
                     value={quiz.category}
                     onChange={handleChange}
                  >
                     <option value="sports">sports</option>
                     <option value="history">history</option>
                     <option value="politics">politics</option>
                  </select>
               </div>

               {/* difficulty, el name tiene q ser "difficulty" */}
               <div className="form-control">
                  <label htmlFor="difficulty">select difficulty</label>
                  <select
                     name="difficulty"
                     id="difficulty"
                     className="form-input"
                     value={quiz.difficulty}
                     onChange={handleChange}
                  >
                     <option value="easy">easy</option>
                     <option value="medium">medium</option>
                     <option value="hard">hard</option>
                  </select>
               </div>

               {/* error */}
               {error && (
                  <p className="error">
                     can't generate questions, please try different options
                  </p>
               )}

               <button
                  type="submit"
                  className="submit-btn"
                  onClick={handleSubmit}
               >
                  start
               </button>
            </form>
         </section>
      </main>
   );
};

export default SetupForm;

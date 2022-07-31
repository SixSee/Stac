// async function addQuiz({ quiz_name, quiz_time, quiz_questions, quiz_subjects }) {
//     const authtoken = localStorage.getItem("authtoken");
//     return await fetch(`${process.env.REACT_APP_BASE_URL}/quiz/q/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": 'application/json',
//             "Authorization": `Bearer ${authtoken}`
//         },
//         body: JSON.stringify({
//             "name": quiz_name,
//             "no_of_questions": parseInt(quiz_questions),
//             "max_time": parseInt(quiz_time),
//             "subjects": quiz_subjects
//         })
//     })
//         .then((res) => res.json()).then(() => window.location.pathname = '/quiz')
// }

// export default addQuiz;
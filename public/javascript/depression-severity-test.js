const staticData = [
  {
    name: 'Little interest or pleasure in doing things?',
    id: 1,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Feeling down, depressed, or hopeless?',
    id: 2,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Trouble falling or staying asleep, or sleeping too much?',
    id: 3,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }

    ]
  },
  {
    name: 'Feeling tired or having little energy?',
    id: 4,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Poor appetite or overeating?',
    id: 5,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
    id: 6,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Trouble concentrating on things, such as reading the newspaper or watching television?',
    id: 7,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?',
    id: 8,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  },
  {
    name: 'Trouble concentrating on things, such as reading the newspaper or watching television?',
    id: 9,
    options: [
      {
        name: 'Not at all',
        point: 0
      },
      {
        name: 'Several days',
        point: 1
      },
      {
        name: 'More than half the days',
        point: 2
      },
      {
        name: 'Nearly every day',
        point: 3
      }
    ]
  }

];

const questionsContainer = document.getElementById('questions-container');
const pointsCounter = document.getElementById('points-counter');
const comment = document.querySelector('.comment');

let totalPoints = [];

questionsContainer.innerHTML = createQuestions(staticData);

addEventListenerToOptions('q-options');

function createQuestions(arr) {
  let domElements = '';

  arr.forEach((question, idx) => {
    const element = `
    <div class="question-box">
    <h4>${question.name}</h4>
    <div class="options">
      <p data-id='${question.id}' data-value="${question.options[0].point}" class='q-options'><span>${question.options[0].name}</span><span>+${question.options[0].point}</span></p>
      <p data-id='${question.id}' data-value="${question.options[1].point}" class='q-options'><span>${question.options[1].name}</span><span>+${question.options[1].point}</span></p>
      <p data-id='${question.id}' data-value="${question.options[2].point}" class='q-options'><span>${question.options[2].name}</span><span>+${question.options[2].point}</span></p>
      <p data-id='${question.id}' data-value="${question.options[3].point}" class='q-options'><span>${question.options[3].name}</span><span>+${question.options[3].point}</span></p>

    </div>
  </div>`;

    domElements += element;
  });

  return domElements;
}

function addEventListenerToOptions(className) {
  const allOptions = document.querySelectorAll(`.${className}`);

  allOptions.forEach((option) => {
    option.addEventListener('click', updateTotalPoints);
  });
}

function updateTotalPoints(e) {
  changeBackgroundWhenSelected(e.target);
  const questionNumber = +e.target.getAttribute('data-id');
  const value = +e.target.getAttribute('data-value');

  const hsQuestion = totalPoints.find((q) => q.questionNumber === questionNumber);
  if (hsQuestion) {
    const updatedArr = totalPoints.filter((q) => q.questionNumber !== hsQuestion.questionNumber);

    updatedArr.push({ questionNumber, value });

    totalPoints = updatedArr;
  } else {
    totalPoints.push({ questionNumber, value });
  }

  let updatedPoint = 0;

  totalPoints.forEach((p) => {
    updatedPoint += p.value;
  });

  pointsCounter.innerHTML = updatedPoint;

  updateComment(updatedPoint);
}

function changeBackgroundWhenSelected(element) {
  const siblings = element.parentElement.children;

  [...siblings].forEach((s) => {
    s.classList.remove('active');
  });

  element.classList.add('active');
}

function updateComment(num) {
  switch (num) {
    case 0:
      comment.innerHTML = 'Scores ≤4 suggest minimal <break>depression which may not require treatment. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 1:
      comment.innerHTML = 'Scores ≤4 suggest minimal depression which may not require treatment. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 2:
      comment.innerHTML = 'Scores ≤4 suggest minimal depression which may not require treatment. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 3:
      comment.innerHTML = 'Scores ≤4 suggest minimal depression which may not require treatment. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 4:
      comment.innerHTML = 'Scores ≤4 suggest minimal depression which may not require treatment. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 5:
      comment.innerHTML = 'Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 6:
      comment.innerHTML = 'Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 7:
      comment.innerHTML = 'Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 8:
      comment.innerHTML = 'Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 9:
      comment.innerHTML = 'Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 10:
      comment.innerHTML = 'Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy. Functionally, the patient does not report limitations due to their symptoms.';
    case 11:
      comment.innerHTML = 'Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 12:
      comment.innerHTML = 'Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 13:
      comment.innerHTML = 'Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 14:
      comment.innerHTML = 'Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 15:
      comment.innerHTML = 'Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 16:
      comment.innerHTML = 'Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 17:
      comment.innerHTML = 'Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 18:
      comment.innerHTML = 'Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 19:
      comment.innerHTML = 'Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy. Functionally, the patient does not report limitations due to their symptoms.';
      break;
    case 20:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms.'
    break;
    case 21:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms.'
    break;
    case 22:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms.'
    break;
    case 23:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms.'
    break;
    case 24:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms. WARNING: This patient is having thoughts concerning for suicidal ideation or self-harm, and should be probed further, referred, or transferred for emergency psychiatric evaluation as clinically appropriate and depending on clinician overall risk assessment.'
    break;
    case 25:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms.WARNING: This patient is having thoughts concerning for suicidal ideation or self-harm, and should be probed further, referred, or transferred for emergency psychiatric evaluation as clinically appropriate and depending on clinician overall risk assessment.'
    break;
    case 26:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms.WARNING: This patient is having thoughts concerning for suicidal ideation or self-harm, and should be probed further, referred, or transferred for emergency psychiatric evaluation as clinically appropriate and depending on clinician overall risk assessment.'
    break;
    case 27:
      comment.innerHTML = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist. Functionally, the patient does not report limitations due to their symptoms. WARNING: This patient is having thoughts concerning for suicidal ideation or self-harm, and should be probed further, referred, or transferred for emergency psychiatric evaluation as clinically appropriate and depending on clinician overall risk assessment.'
    break;
    default:
      break;
  }
}

import React, { useEffect, useMemo, useState } from "react";
import "../../App.css";
import { useAuth } from "../../hooks/useAuth";

const EXAM_CONFIG = {
  examKey: "az104",
  examLabel: "AZ 104",
};

const DOMAINS = [
  {
    short: "identity_governance",
    long: "Manage Azure identities and governance",
  },
  {
    short: "storage",
    long: "Implement and manage storage",
  },
  {
    short: "compute",
    long: "Deploy and manage Azure compute resources",
  },
  {
    short: "networking",
    long: "Implement and manage virtual networking",
  },
  {
    short: "monitoring",
    long: "Monitor and maintain Azure resources",
  },
];

const RANDOM_COUNTS = [10, 25, 50, 100];
const IDK_OPTION = "I don't know";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeQuestions(rawQuestions = [], preserveOptionOrder = false) {
  return rawQuestions.map((q, index) => {
    const isTF = q.question_type === "tf";

    let options = [];
    if (isTF) {
      options = ["True", "False"];
    } else {
      options = Array.isArray(q.options) ? q.options : [];
    }

    const filteredOptions = options.filter((option) => option !== IDK_OPTION);
    const orderedOptions = preserveOptionOrder
      ? filteredOptions
      : shuffleArray(filteredOptions);

    return {
      ...q,
      id: q._id || q.id || `q-${index}-${Math.random().toString(36).slice(2)}`,
      options: [...orderedOptions, IDK_OPTION],
    };
  });
}

function calculateScore(questions, answers) {
  let correct = 0;
  const byDomain = {};

  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct_answer;

    if (isCorrect) correct += 1;

    if (!byDomain[q.domain]) {
      byDomain[q.domain] = {
        total: 0,
        correct: 0,
      };
    }

    byDomain[q.domain].total += 1;
    if (isCorrect) byDomain[q.domain].correct += 1;
  });

  return {
    total: questions.length,
    correct,
    percent: questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0,
    byDomain,
  };
}

export default function PracticeTestApp() {
  const { user } = useAuth();
  const username = user?.email || "";

  const [mode, setMode] = useState("practice");
  const [selectionType, setSelectionType] = useState("random");
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0].short);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [revealedPractice, setRevealedPractice] = useState({});
  const [submittedTest, setSubmittedTest] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [saveStatus, setSaveStatus] = useState("");

  const [checkingProgress, setCheckingProgress] = useState(true);
  const [existingProgress, setExistingProgress] = useState(null);
  const [progressActionLoading, setProgressActionLoading] = useState(false);

  const activeQuestion = questions[currentIndex];

  const domainMap = useMemo(() => {
    const map = {};
    DOMAINS.forEach((d) => {
      map[d.short] = d.long;
    });
    return map;
  }, []);

  const score = useMemo(() => {
    if (!questions.length) return null;
    return calculateScore(questions, answers);
  }, [questions, answers]);

  const allAnswered = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q) => answers[q.id] !== undefined);
  }, [questions, answers]);

  const sessionComplete = useMemo(() => {
    if (mode === "test") return submittedTest;
    return practiceComplete;
  }, [mode, submittedTest, practiceComplete]);

  useEffect(() => {
    if (username) {
      loadExistingProgress();
    } else {
      setCheckingProgress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  async function loadExistingProgress() {
    if (!username) return;

    setCheckingProgress(true);
    setError("");

    try {
      const response = await fetch(
        `/api/study/loadtestprogress?examLabel=${encodeURIComponent(EXAM_CONFIG.examLabel)}`
      );

      if (!response.ok) {
        throw new Error("Failed to load saved progress");
      }

      const data = await response.json();

      if (data?.hasInProgressTest && data?.progress) {
        setExistingProgress(data.progress);
      } else {
        setExistingProgress(null);
      }
    } catch (err) {
      setError(err.message || "Unable to check saved progress");
      setExistingProgress(null);
    } finally {
      setCheckingProgress(false);
    }
  }

  async function fetchQuestions() {
    setLoading(true);
    setError("");
    setExistingProgress(null);
    setQuestions([]);
    setAnswers({});
    setRevealedPractice({});
    setSubmittedTest(false);
    setPracticeComplete(false);
    setCurrentIndex(0);

    try {
      const payload =
        selectionType === "domain"
          ? {
              domain: selectedDomain,
            }
          : {
              numberOfQuestions: questionCount,
            };

      const response = await fetch("/api/study/getquestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      const fetchedQuestions = Array.isArray(data) ? data : data.questions || [];
      setQuestions(normalizeQuestions(fetchedQuestions, false));
    } catch (err) {
      setError(err.message || "Unable to load questions");
    } finally {
      setLoading(false);
    }
  }

  async function saveTestProgress(
    updatedAnswers,
    deliveredQuestions = questions,
    overrideSubmittedTest = submittedTest,
    overrideCurrentIndex = currentIndex
  ) {
    if (!username || !deliveredQuestions.length) return;

    setSaveStatus("Saving...");

    const payload = {
      username,
      examKey: EXAM_CONFIG.examKey,
      examLabel: EXAM_CONFIG.examLabel,
      mode,
      selection: {
        type: selectionType,
        questionCount: selectionType === "random" ? questionCount : null,
        domain: selectionType === "domain" ? selectedDomain : null,
      },
      currentIndex: overrideCurrentIndex,
      deliveredQuestions: deliveredQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        domain: q.domain,
      })),
      answers: updatedAnswers,
      submittedTest: overrideSubmittedTest,
      savedAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/study/savetestprogress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(""), 1500);
    } catch (err) {
      setSaveStatus("Save failed");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  }

  function handleContinueSavedTest() {
    if (!existingProgress) return;

    const savedMode = existingProgress.mode || "practice";
    const savedAnswers = existingProgress.answers || {};
    const savedQuestions = normalizeQuestions(
      existingProgress.deliveredQuestions || [],
      true
    );

    const restoredPracticeComplete =
      savedMode === "practice" &&
      savedQuestions.length > 0 &&
      savedQuestions.every((q) => savedAnswers[q.id] !== undefined);

    setMode(savedMode);
    setSelectionType(existingProgress.selection?.type || "random");
    setQuestionCount(existingProgress.selection?.questionCount || 10);
    setSelectedDomain(existingProgress.selection?.domain || DOMAINS[0].short);

    setQuestions(savedQuestions);
    setAnswers(savedAnswers);
    setSubmittedTest(!!existingProgress.submittedTest);
    setPracticeComplete(restoredPracticeComplete);
    setCurrentIndex(existingProgress.currentIndex || 0);

    setRevealedPractice(
      savedMode === "practice"
        ? Object.fromEntries(savedQuestions.map((q) => [q.id, !!savedAnswers[q.id]]))
        : {}
    );

    setExistingProgress(null);
    setError("");
  }

  async function handleDeleteSavedTest() {
    if (!username) return;

    setProgressActionLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/study/deletetestprogress?examLabel=${encodeURIComponent(EXAM_CONFIG.examLabel)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete saved progress");
      }

      setExistingProgress(null);
      handleRestart();
    } catch (err) {
      setError(err.message || "Unable to delete saved progress");
    } finally {
      setProgressActionLoading(false);
    }
  }

  function handleAnswer(questionId, selectedOption) {
    if (submittedTest || practiceComplete) return;

    const updatedAnswers = {
      ...answers,
      [questionId]: selectedOption,
    };

    setAnswers(updatedAnswers);

    if (mode === "practice") {
      setRevealedPractice((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    }

    saveTestProgress(updatedAnswers);
  }

  function handleSubmitTest() {
    setSubmittedTest(true);
    saveTestProgress(answers, questions, true, currentIndex);
  }

  function handleFinishPractice() {
    setPracticeComplete(true);
    saveTestProgress(answers, questions, false, currentIndex);
  }

  function handleRestart() {
    setQuestions([]);
    setAnswers({});
    setRevealedPractice({});
    setSubmittedTest(false);
    setPracticeComplete(false);
    setCurrentIndex(0);
    setError("");
    setSaveStatus("");
  }

  function getQuestionStatus(question) {
    const userAnswer = answers[question.id];
    const isAnswered = userAnswer !== undefined;
    const isCorrect = userAnswer === question.correct_answer;

    return {
      isAnswered,
      isCorrect,
    };
  }

  function getNavigatorClass(q, index) {
    const status = getQuestionStatus(q);
    const isCurrent = index === currentIndex;

    let className = "study-nav-number";

    if (status.isAnswered) className += " study-nav-number-answered";
    if (sessionComplete) {
      className += status.isCorrect
        ? " study-nav-number-correct"
        : " study-nav-number-incorrect";
    }
    if (isCurrent) className += " study-nav-number-current";

    return className;
  }

  function getOptionClass(option) {
    const selected = answers[activeQuestion.id] === option;
    const showFeedback =
      mode === "practice"
        ? revealedPractice[activeQuestion.id]
        : submittedTest;
    const isCorrectOption = option === activeQuestion.correct_answer;
    const isIdkOption = option === IDK_OPTION;

    let className = "study-option-card";

    if (selected) className += " study-option-selected";
    if (showFeedback && isCorrectOption) className += " study-option-correct";
    if (showFeedback && selected && (!isCorrectOption || isIdkOption)) {
      className += " study-option-incorrect";
    }

    return className;
  }

  return (
    <div className="study-app">
      <div className="study-shell">
        <div className="study-hero">
          <h1 className="study-title">{EXAM_CONFIG.examLabel} Practice Test</h1>
          <p className="study-subtitle">
            Practice by domain or generate a randomized exam session.
          </p>
        </div>

        {checkingProgress && !questions.length && (
          <div className="study-card study-card-setup">
            <h2>Checking saved progress...</h2>
            <p className="study-subtle-text">
              Looking for an in-progress {EXAM_CONFIG.examLabel} test.
            </p>
          </div>
        )}

        {!checkingProgress && !questions.length && existingProgress && (
          <div className="study-card study-card-setup">
            <h2>Resume In-Progress Test</h2>
            <p className="study-subtitle-inline">
              You already have an in-progress {EXAM_CONFIG.examLabel} test saved.
            </p>

            <div className="study-form-row">
              <label className="study-label">Signed in as</label>
              <div className="study-user-pill">{username || "Authenticated user"}</div>
            </div>

            <div className="study-resume-details">
              <p>
                <strong>Mode:</strong> {existingProgress.mode}
              </p>
              <p>
                <strong>Selection:</strong>{" "}
                {existingProgress.selection?.type === "domain"
                  ? `Domain - ${
                      domainMap[existingProgress.selection?.domain] ||
                      existingProgress.selection?.domain
                    }`
                  : `Random - ${existingProgress.selection?.questionCount || 0} questions`}
              </p>
              <p>
                <strong>Progress:</strong>{" "}
                {Object.keys(existingProgress.answers || {}).length} answered out of{" "}
                {(existingProgress.deliveredQuestions || []).length}
              </p>
            </div>

            <div className="study-action-row">
              <button
                className="study-btn study-btn-primary"
                onClick={handleContinueSavedTest}
                disabled={progressActionLoading}
              >
                Continue Test
              </button>

              <button
                className="study-btn study-btn-secondary"
                onClick={handleDeleteSavedTest}
                disabled={progressActionLoading}
              >
                {progressActionLoading ? "Deleting..." : "Delete and Start New"}
              </button>
            </div>

            {error && <div className="study-error">{error}</div>}
          </div>
        )}

        {!checkingProgress && !questions.length && !existingProgress && (
          <div className="study-card study-card-setup">
            <h2>Start a Study Session</h2>

            <div className="study-form-row">
              <label className="study-label">Signed in as</label>
              <div className="study-user-pill">{username || "Authenticated user"}</div>
            </div>

            <div className="study-form-row">
              <label className="study-label">Mode</label>
              <div className="study-inline-group">
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="practice"
                    checked={mode === "practice"}
                    onChange={() => setMode("practice")}
                  />
                  <span>Practice Mode</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="test"
                    checked={mode === "test"}
                    onChange={() => setMode("test")}
                  />
                  <span>Test Mode</span>
                </label>
              </div>
            </div>

            <div className="study-form-row">
              <label className="study-label">Question Selection</label>
              <div className="study-inline-group">
                <label>
                  <input
                    type="radio"
                    name="selectionType"
                    value="random"
                    checked={selectionType === "random"}
                    onChange={() => setSelectionType("random")}
                  />
                  <span>Random Questions</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="selectionType"
                    value="domain"
                    checked={selectionType === "domain"}
                    onChange={() => setSelectionType("domain")}
                  />
                  <span>By Knowledge Domain</span>
                </label>
              </div>
            </div>

            {selectionType === "random" ? (
              <div className="study-form-row">
                <label className="study-label">Number of Questions</label>
                <select
                  className="study-select"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                >
                  {RANDOM_COUNTS.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="study-form-row">
                <label className="study-label">Domain</label>
                <select
                  className="study-select"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {DOMAINS.map((domain) => (
                    <option key={domain.short} value={domain.short}>
                      {domain.long}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="study-domain-list">
              <strong>Domains</strong>
              <ul>
                {DOMAINS.map((domain) => (
                  <li key={domain.short}>
                    <code>{domain.short}</code>
                    <span>{domain.long}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="study-btn study-btn-primary"
              onClick={fetchQuestions}
              disabled={loading}
            >
              {loading ? "Loading..." : "Start Test"}
            </button>

            {error && <div className="study-error">{error}</div>}
          </div>
        )}

        {!!questions.length && activeQuestion && (
          <div className="study-layout">
            <div className="study-sidebar">
              <div className="study-card">
                <h3>Session Info</h3>
                <p>
                  <strong>User:</strong> {username || "Authenticated user"}
                </p>
                <p>
                  <strong>Exam:</strong> {EXAM_CONFIG.examLabel}
                </p>
                <p>
                  <strong>Mode:</strong> {mode === "practice" ? "Practice" : "Test"}
                </p>
                <p>
                  <strong>Questions:</strong> {questions.length}
                </p>
                <p>
                  <strong>Save status:</strong> {saveStatus || "Idle"}
                </p>

                <button className="study-btn study-btn-secondary" onClick={handleRestart}>
                  End Session
                </button>
              </div>

              <div className="study-card">
                <h3>Question Navigator</h3>
                <div className="study-question-grid">
                  {questions.map((q, index) => (
                    <button
                      key={q.id}
                      className={getNavigatorClass(q, index)}
                      onClick={() => setCurrentIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="study-main">
              <div className="study-card">
                <div className="study-question-header">
                  <div>
                    <h2>
                      Question {currentIndex + 1} of {questions.length}
                    </h2>
                    <p className="study-domain-tag">
                      {domainMap[activeQuestion.domain] || activeQuestion.domain}
                    </p>
                    <p className="study-question-type">
                      {activeQuestion.question_type === "tf"
                        ? "True / False"
                        : "Multiple Choice"}
                    </p>
                  </div>
                </div>

                <div className="study-question-text">{activeQuestion.question}</div>

                <div className="study-options-list">
                  {activeQuestion.options.map((option, idx) => {
                    const selected = answers[activeQuestion.id] === option;

                    return (
                      <label
                        key={`${activeQuestion.id}-${idx}`}
                        className={getOptionClass(option)}
                      >
                        <input
                          type="radio"
                          name={activeQuestion.id}
                          value={option}
                          checked={selected}
                          onChange={() => handleAnswer(activeQuestion.id, option)}
                          disabled={submittedTest || practiceComplete}
                          className="study-option-input"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                {((mode === "practice" && revealedPractice[activeQuestion.id]) ||
                  (mode === "test" && submittedTest)) && (
                  <div className="study-feedback-box">
                    <p>
                      <strong>Correct Answer:</strong> {activeQuestion.correct_answer}
                    </p>
                    <p>
                      <strong>Explanation:</strong> {activeQuestion.explanation}
                    </p>
                  </div>
                )}

                <div className="study-navigation-row">
                  <button
                    className="study-btn study-btn-secondary"
                    onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>

                  <button
                    className="study-btn study-btn-secondary"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(prev + 1, questions.length - 1)
                      )
                    }
                    disabled={currentIndex === questions.length - 1}
                  >
                    Next
                  </button>
                </div>

                {mode === "test" && !submittedTest && (
                  <div className="study-submit-row">
                    <button
                      className="study-btn study-btn-primary"
                      onClick={handleSubmitTest}
                      disabled={!allAnswered}
                      title={!allAnswered ? "Answer all questions before submitting" : ""}
                    >
                      Submit Test
                    </button>
                    {!allAnswered && (
                      <p className="study-note">
                        You must answer all questions before submitting in test mode.
                      </p>
                    )}
                  </div>
                )}

                {mode === "practice" && !practiceComplete && (
                  <div className="study-submit-row">
                    <button
                      className="study-btn study-btn-primary"
                      onClick={handleFinishPractice}
                      disabled={!allAnswered}
                      title={
                        !allAnswered ? "Answer all questions before finishing practice" : ""
                      }
                    >
                      Finish Practice
                    </button>
                    {!allAnswered && (
                      <p className="study-note">
                        You must answer all questions before finishing practice.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {sessionComplete && score && (
                <div className="study-card">
                  <h2>{mode === "practice" ? "Practice Summary" : "Test Results"}</h2>
                  <p>
                    <strong>Score:</strong> {score.correct} / {score.total} ({score.percent}
                    %)
                  </p>

                  <h3>Performance by Domain</h3>
                  <table className="study-table">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Correct</th>
                        <th>Total</th>
                        <th>Percent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DOMAINS.map((domain) => {
                        const stat = score.byDomain[domain.short] || {
                          correct: 0,
                          total: 0,
                        };
                        const percent = stat.total
                          ? Math.round((stat.correct / stat.total) * 100)
                          : 0;

                        return (
                          <tr key={domain.short}>
                            <td>{domain.long}</td>
                            <td>{stat.correct}</td>
                            <td>{stat.total}</td>
                            <td>{percent}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <h3 className="study-review-title">Question Review</h3>
                  {questions.map((q, idx) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correct_answer;

                    return (
                      <div key={q.id} className="study-review-card">
                        <p>
                          <strong>
                            {idx + 1}. {q.question}
                          </strong>
                        </p>
                        <p>
                          <strong>Domain:</strong> {domainMap[q.domain] || q.domain}
                        </p>
                        <p>
                          <strong>Your Answer:</strong> {userAnswer || "No answer"}
                        </p>
                        <p>
                          <strong>Correct Answer:</strong> {q.correct_answer}
                        </p>
                        <p>
                          <strong>Result:</strong>{" "}
                          <span
                            className={
                              isCorrect ? "study-result-correct" : "study-result-incorrect"
                            }
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        </p>
                        <p>
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

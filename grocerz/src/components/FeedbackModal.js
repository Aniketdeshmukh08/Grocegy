import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import "react-toastify/dist/ReactToastify.css";

export default function FeedbackModal() {

  const [selectedRating, setSelectedRating] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [allowFollowUp, setAllowFollowUp] = useState("yes");
  const [isOpen, setIsOpen] = useState(false);
  const [userid, setUserid] = useState(localStorage.getItem("userid"));

  useEffect(() => {
    setUserid(localStorage.getItem("userid"));
  }, []);

  const emojiRatings = [
    { value: 0, emoji: "😢", label: "Very sad" },
    { value: 1, emoji: "😞", label: "Sad" },
    { value: 2, emoji: "😐", label: "Neutral" },
    { value: 3, emoji: "😊", label: "Happy" },
    { value: 4, emoji: "😄", label: "Very happy" },
  ];

const handleSend = async () => {

  if (!userid) {
    toast.error("User not logged in.");
    return;
  }

  if (!feedback || feedback.trim() === "") {
    toast.error("Please enter feedback.");
    return;
  }

  try {

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}feedback/createFeedback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userid: userid,
          message: feedback,
          rating: selectedRating
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      toast.success("Feedback submitted successfully!");

      setFeedback("");
      setSelectedRating(3);
      setIsOpen(false);

    } else {

      toast.error(data.error || "Failed to submit feedback");

    }

  } catch (error) {

    console.error("Feedback error:", error);
    toast.error("Server error while submitting feedback.");

  }
};

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen ? (
        <button
          className="shop-btn btn btn-success px-4 my-4"
          onClick={() => setIsOpen(true)}
        >
          Submit Feedback
        </button>
      ) : (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Give feedback</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
              </div>

              <div className="modal-body">

                <p className="text-muted">
                  What do you think of the editing tool?
                </p>

                <div className="d-flex justify-content-center gap-2 my-3">

                  {emojiRatings.map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setSelectedRating(rating.value)}
                      className={`btn btn-light fs-3 rounded-circle p-2 mx-1 ${
                        selectedRating === rating.value
                          ? "border border-warning bg-warning-subtle"
                          : ""
                      }`}
                    >
                      {rating.emoji}
                    </button>
                  ))}

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Do you have any thoughts you'd like to share?
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts..."
                  ></textarea>

                </div>

                <div className="mb-3 text-start">

                  <label className="form-label">
                    May we follow you up on your feedback?
                  </label>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={allowFollowUp === "yes"}
                      onChange={() => setAllowFollowUp("yes")}
                    />
                    <label className="form-check-label">Yes</label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={allowFollowUp === "no"}
                      onChange={() => setAllowFollowUp("no")}
                    />
                    <label className="form-check-label">No</label>
                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-success btn-lg"
                  onClick={handleSend}
                >
                  Send
                </button>

                <button
                  className="btn btn-danger btn-lg"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
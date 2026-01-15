document.addEventListener("DOMContentLoaded", () => {
  const suggestionForm = document.getElementById("suggestion-form");
  const messageDiv = document.getElementById("message");

  // Show message function
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove("hidden");

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Hide message after 8 seconds
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 8000);
  }

  // Handle form submission
  suggestionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form data
    const formData = {
      class_name: document.getElementById("class-name").value.trim(),
      description: document.getElementById("description").value.trim(),
      category: document.getElementById("category").value,
      email: document.getElementById("email").value.trim(),
    };

    // Validate fields
    if (!formData.class_name) {
      showMessage("Please enter a class name.", "error");
      return;
    }

    if (!formData.description) {
      showMessage("Please enter a description.", "error");
      return;
    }

    if (!formData.category) {
      showMessage("Please select a category.", "error");
      return;
    }

    if (!formData.email) {
      showMessage("Please enter your email.", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    try {
      // Submit the suggestion
      const response = await fetch("/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(
          result.message ||
            "Thank you for your suggestion! We'll review it soon.",
          "success"
        );
        // Reset form on success
        suggestionForm.reset();
      } else {
        showMessage(
          result.detail || "Failed to submit suggestion. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      showMessage(
        "Failed to submit suggestion. Please try again later.",
        "error"
      );
    }
  });
});

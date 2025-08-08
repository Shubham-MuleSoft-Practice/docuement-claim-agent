document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const secureCode = document.getElementById('secureCode').value.trim();
  const messageDiv = document.getElementById('message');
  const submitButton = this.querySelector('button[type="submit"]');

  // Reset message and update button
  messageDiv.textContent = '';
  messageDiv.className = 'message';
  submitButton.disabled = true;
  submitButton.textContent = 'Uploading... ⏳';

  if (!/^\d{6}$/.test(secureCode)) {
    messageDiv.textContent = 'Please enter a valid 6-digit code.';
    messageDiv.classList.add('error');
    submitButton.disabled = false;
    submitButton.textContent = 'Send File';
    return;
  }

  const file = fileInput.files[0];
  if (!file) {
    messageDiv.textContent = 'Please select a PDF file.';
    messageDiv.classList.add('error');
    submitButton.disabled = false;
    submitButton.textContent = 'Send File';
    return;
  }

  if (file.type !== "application/pdf") {
    messageDiv.textContent = 'Only PDF files are allowed.';
    messageDiv.classList.add('error');
    submitButton.disabled = false;
    submitButton.textContent = 'Send File';
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`https://document-upload-agent-file-4uxrc0.5sc6y6-3.usa-e2.cloudhub.io/api/claim-Pdf?secureCode=${secureCode}`, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok && result.contentId) {
      messageDiv.textContent = "✅ File uploaded successfully!";
      messageDiv.classList.add('success');

      document.getElementById("claimIdField").value = result.contentId;
      document.getElementById("claimIdSection").style.display = 'block';

      document.getElementById('uploadForm').reset();
    } else {
      messageDiv.textContent = result.message || "Upload failed. Check your secure code.";
      messageDiv.classList.add('error');
    }
  } catch (error) {
    console.error("Upload error:", error);
    messageDiv.textContent = "An error occurred while uploading.";
    messageDiv.classList.add('error');
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = 'Send File';
  }
});

function copyClaimId() {
  const claimIdField = document.getElementById("claimIdField");
  claimIdField.select();
  claimIdField.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Claim ID copied to clipboard!");
}

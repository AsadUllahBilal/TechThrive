async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file ${file.name}`);
    }

    const data = await response.json();
    uploadedUrls.push(data.url); // Assuming API returns { url: '...' }
  }

  return uploadedUrls;
}

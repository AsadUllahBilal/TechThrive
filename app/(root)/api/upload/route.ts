import { NextResponse } from "next/server";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false, // Important to disable Next.js body parser
  },
};

// Helper to create a fake IncomingMessage from the Web Request
function createReq(stream: Readable, headers: Record<string, string>) {
  // formidable needs these properties on the request object
  return Object.assign(stream, {
    headers,
    method: "POST",
  });
}

export async function POST(req: Request) {
  // Read full request body into buffer
  const buffer = Buffer.from(await req.arrayBuffer());

  // Create a Node.js readable stream from the buffer
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  // Create a fake request object with headers (formidable needs headers like content-length)
  const fakeReq = createReq(stream, Object.fromEntries(req.headers.entries()));

  // Initialize formidable form parser
  const form = formidable({ multiples: true });

  try {
    // Parse form data using formidable
    const { fields, files } = await new Promise<
      formidable.Fields & { files: formidable.Files }
    >((resolve, reject) => {
      form.parse(fakeReq as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ ...fields, files });
      });
    });

    // Get the uploaded file (handle single or multiple)
    const fileData = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!fileData) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Upload file to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(
      // @ts-ignore
      fileData.filepath || fileData.filePath || fileData.path
    );

    // Return the secure URL of uploaded image
    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to parse or upload file" },
      { status: 500 }
    );
  }
}

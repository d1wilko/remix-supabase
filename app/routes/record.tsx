import {
  ActionFunctionArgs,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { FC } from "react";
// import AudioRecorder from "~/components/AudioRecorder";
import { createSupabaseServerClient } from "~/supabase.server";

// Define the action function
export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler = unstable_createMemoryUploadHandler();

  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  // Get the file from the request body
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const title = formData.get("title");
  const file = formData.get("audioUrl");

  const filename = crypto.randomUUID();

  // Upload the file to Supabase
  const { error: uploadError } = await supabaseClient.storage
    .from("tracks")
    .upload(filename, file!, { upsert: true });

  if (uploadError) {
    return redirect("/upload", { headers });
  }

  // Create a new database entry with the file URL
  const { error: dbError } = await supabaseClient.from("tracks").insert({
    file_name: filename,
    author: user!.email as string,
    title: title as string,
  });

  if (dbError) {
    return redirect("/upload", { headers });
  }

  return redirect("/upload", { headers });
};

const Record: FC = () => {
  return (
    <Form
      className="flex flex-col gap-6 justify-center items-center h-full"
      method="post"
      encType="multipart/form-data"
      action="/record"
    >
      <input
        className="input input-bordered input-primary"
        name="title"
        placeholder="Title"
      />
      <input
        className="file-input file-input-bordered file-input-primary"
        type="file"
        name="audioUrl"
      />
      <button className="btn btn-secondary text-white" type="submit">
        Upload Recording
      </button>
    </Form>
  );

  // const [audioBlob, setAudioBlob] = useState<File | null>(null);

  // return (
  //   <div className="flex flex-col gap-4 justify-center items-center h-full">
  //     <AudioRecorder setUploadBlob={setAudioBlob} />
  //     {audioBlob && (
  //       <Form method="post" encType="multipart/form-data" action="/record">
  //         <input type="hidden" name="audioUrl" value={audioBlob} />
  //         <button className="btn btn-secondary text-white" type="submit">
  //           Upload Recording
  //         </button>
  //       </Form>
  //     )}
  //   </div>
  // );
};

export default Record;

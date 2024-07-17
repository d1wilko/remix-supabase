import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { CurrentTrackContext } from "~/context/CurrentTrackContext";
import { createSupabaseServerClient } from "~/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "SoundBug" },
    { name: "description", content: "Welcome to SoundBug!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { data: dbData } = await supabaseClient.from("tracks").select("*");

  if (!dbData) {
    return json(null);
  }

  const fileNames = dbData.map((track) => track.file_name);

  const { data: storageData, error } = await supabaseClient.storage
    .from("tracks")
    .createSignedUrls(fileNames, 60 * 60);

  const dbDataWithUrls = dbData.map((track, index) => {
    return {
      ...track,
      signedUrl: storageData![index].signedUrl,
    };
  });

  return json(dbDataWithUrls);
};

const Index = () => {
  const tracks = useLoaderData<typeof loader>();
  const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);

  const handlePlay = (track: string) => {
    setCurrentTrack(track);
  };

  return (
    <div className="flex justify-center items-center flex-col gap-8">
      <h1 className="text-7xl text-neutral-content">Welcome to SoundBug</h1>
      <Link to="/record" className="btn btn-primary btn-lg">
        Upload a track
      </Link>
      <h3 className="text-2xl text-neutral-content">
        Or heres some tracks to get you started
      </h3>
      {tracks ? (
        <ul className="grid grid-cols-1 gap-4">
          {tracks.map((track) => (
            <li
              key={track.id}
              className={`card w-96 text-primary-content ${
                currentTrack === track.signedUrl ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div className="card-body">
                <h2 className="card-title">{track.title}</h2>
                <p>{track.author}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn"
                    onClick={() => {
                      handlePlay(track.signedUrl);
                    }}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading tracks...</p>
      )}
    </div>
  );
};

export default Index;

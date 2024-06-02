/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import * as d3 from "d3";
import { GithubIcon } from "lucide-react";

// Data for the pie chart
const data = [
  { label: "tweets", value: 30 },
  { label: "commits", value: 50 },
];

const colors = ["#1DA1F2", "#26a641"];

// Interface for data item
interface DataItem {
  label: string;
  value: number;
}

// Interface for props
interface PieChartProps {
  data: DataItem[];
}

// Functional component for the pie chart
const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Set dimensions for the SVG
  const width = 500;
  const height = 500;

  // @ts-expect-error asd
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const pie = d3.pie().value((d) => d.value);

  // @ts-expect-error asd
  const arcs = pie(data);

  // Define arc generator
  const arcGenerator: d3.Arc<unknown, d3.DefaultArcObject> = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

  // Generate JSX for the pie chart
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {arcs.map((arc, index) => (
          <path
            key={index}
            fill={colors[index]}
            // @ts-expect-error asd
            d={arcGenerator(arc) ?? ""}
          />
        ))}
      </g>
    </svg>
  );
};

export async function GET(req: Request) {
  // get github, twitter, commits, tweets
  const parsed = new URL(req.url).searchParams;
  const github = parsed.get("github");
  const twitter = parsed.get("twitter");
  const commits = parsed.get("commits");
  const tweets = parsed.get("tweets");
  const displayName = parsed.get("displayName");
  if (!github || !twitter || !commits || !tweets || !displayName) {
    return new Response("Missing parameters", { status: 400 });
  }

  // i.e name tweets 32.1x more than they commit!
  const tweetToCommitRatio = Number(tweets) / Number(commits);
  const txt =
    tweetToCommitRatio > 1
      ? `${displayName} tweets ${tweetToCommitRatio.toFixed(
          2,
        )}x times more than they commit`
      : `${displayName} commits ${(1 / tweetToCommitRatio).toFixed(
          2,
        )}x times more than they tweet`;

  const UserMetadata = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "flex-start",
      }}
    >
      <h1>{displayName}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
          justifyContent: "flex-start",
          fontSize: "24px",
          paddingBottom: "10px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        {`${commits} commits`}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
          justifyContent: "flex-start",
          fontSize: "24px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
        {`${tweets} tweets`}
      </div>
    </div>
  );

  const UserInfo = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <img
        src={`https://github.com/${github}.png`}
        alt="avatar"
        style={{
          width: "128px",
          height: "128px",
          borderRadius: "50%",
        }}
      />
      <UserMetadata />
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: "40px",
            paddingTop: "50px",
            paddingBottom: "50px",
          }}
        >
          <UserInfo />
          <span
            style={{
              fontSize: "30px",
              maxWidth: "450px",
            }}
          >
            {txt}
          </span>
        </div>
        <PieChart data={data} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
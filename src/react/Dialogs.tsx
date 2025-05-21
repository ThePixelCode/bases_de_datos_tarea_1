import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormDeveloper from "./forms/FormDeveloper";
import FormPlayer from "./forms/FormPlayer";
import FormTag from "./forms/FormTag";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericInfo from "./GenericInfo";
import ShowTag from "./tables/ShowTag";
import { Suspense } from "react";
import ShowDeveloper from "./tables/ShowDeveloper";
import FormGame from "./forms/FormGame";
import ShowGame from "./tables/ShowGame";
import FormGameTag from "./forms/FormGameTag";
import ShowGameTag from "./tables/ShowGameTag";
import ShowPlayer from "./tables/ShowPlayer";
import ShowPlayerGame from "./tables/ShowPlayerGame";
import FormPlayerGame from "./forms/FormPlayerGame";

export default function Dialogs() {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="developer">Developer</TabsTrigger>
        <TabsTrigger value="game">Game</TabsTrigger>
        <TabsTrigger value="tag">Tag</TabsTrigger>
        <TabsTrigger value="gameToTags">Game-Tag</TabsTrigger>
        <TabsTrigger value="player">Player</TabsTrigger>
        <TabsTrigger value="playerToGames">Player-Game</TabsTrigger>
        <TabsTrigger value="savedPlay">Saved Play</TabsTrigger>
        <TabsTrigger value="friendship">Friendship</TabsTrigger>
      </TabsList>
      <TabsContent value="developer">
        <Card>
          <CardHeader>
            <CardTitle>Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo
              createForm={<FormDeveloper />}
              readForm={
                <Suspense fallback={<h1>Loading</h1>}>
                  <ShowDeveloper />
                </Suspense>
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="friendship">
        <Card>
          <CardHeader>
            <CardTitle>Friendship</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo
              createForm={<FormDeveloper />}
              readForm={
                <Suspense fallback={<h1>Loading</h1>}>
                  <ShowDeveloper />
                </Suspense>
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="game">
        <Card>
          <CardHeader>
            <CardTitle>Game</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo createForm={<FormGame />} readForm={<ShowGame />} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="player">
        <Card>
          <CardHeader>
            <CardTitle>Player</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo
              createForm={<FormPlayer />}
              readForm={
                <Suspense fallback={<h1>Loading</h1>}>
                  <ShowPlayer />
                </Suspense>
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tag">
        <Card>
          <CardHeader>
            <CardTitle>Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo
              createForm={<FormTag />}
              readForm={
                <Suspense fallback={<h1>Loading</h1>}>
                  <ShowTag />
                </Suspense>
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="gameToTags">
        <Card>
          <CardHeader>
            <CardTitle>Game-Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo
              createForm={<FormGameTag />}
              readForm={
                <Suspense fallback={<h1>Loading</h1>}>
                  <ShowGameTag />
                </Suspense>
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="playerToGames">
        <Card>
          <CardHeader>
            <CardTitle>Player-Game</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericInfo
              createForm={<FormPlayerGame />}
              readForm={
                <Suspense fallback={<h1>Loading</h1>}>
                  <ShowPlayerGame />
                </Suspense>
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="savedPlay">
        <Card>
          <CardHeader>
            <CardTitle>Saved Play</CardTitle>
          </CardHeader>
          <CardContent>
            <FormTag />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

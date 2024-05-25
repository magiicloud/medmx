"use client";
import React, { useState } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { AudioLinesIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RowData } from "./TableComponent";
import { motion } from "framer-motion";

const Counselling = ({ item }: any) => {
  const [playingRow, setPlayingRow] = useState<number | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string }>({});
  const queryClient = useQueryClient();

  const textToSpeech = useMutation({
    mutationFn: async ({
      speechString,
      fileNameString,
    }: {
      speechString: string;
      fileNameString: string;
      rowKey: number;
    }) => {
      const response = await axios.post("/api/medications/textSpeech", {
        speechString,
        fileNameString,
      });
      return response.data.tts;
    },
    onSuccess: (audioContent, { rowKey }) => {
      const audioUrl = `data:audio/mp3;base64,${audioContent}`;
      setAudioUrls((prev) => ({
        ...prev,
        [rowKey]: audioUrl,
      }));
      queryClient.invalidateQueries({ queryKey: ["tts"] });
    },
  });

  const handlePlayAudio = (item: RowData) => {
    setPlayingRow(item.key);

    if (audioUrls[item.key]) {
      // Use cached audio URL if available
      setPlayingRow(item.key);
    } else {
      // Fetch audio from API and cache it
      textToSpeech.mutate({
        speechString: item.counsellingPointsText,
        fileNameString: item.drugName,
        rowKey: item.key,
      });
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <Tooltip
          size="sm"
          color="secondary"
          placement="bottom"
          showArrow={true}
          content="Click to listen to counselling points"
        >
          <Button
            isIconOnly
            variant="light"
            onClick={() => handlePlayAudio(item)}
          >
            {textToSpeech.isPending && playingRow === item.key ? (
              <Spinner />
            ) : (
              <AudioLinesIcon />
            )}
          </Button>
        </Tooltip>

        {playingRow === item.key && audioUrls[item.key] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <audio
              controls
              controlsList="nodownload"
              className="max-w-96 pr-3 h-8 hidden lg:block"
              autoPlay
            >
              <source src={audioUrls[item.key]} type="audio/mp3" />
            </audio>
          </motion.div>
        )}
      </div>
      <p className="pt-3 mb-3">{item.counsellingPointsText}</p>
    </>
  );
};

export default Counselling;

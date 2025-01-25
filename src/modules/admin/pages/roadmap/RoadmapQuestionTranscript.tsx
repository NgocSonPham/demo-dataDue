import { Flex, Heading, VStack } from "@chakra-ui/react";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectSpecialities } from "../../../../redux/slice";

export default function RoadmapQuestionTranscript({
  transtripts,
  onChange
}: {
  transtripts: any;
  onChange: (transcriptId: number, value: number) => void;
}) {
  const specialityList = useAppSelector(selectSpecialities);

  return (
    <VStack spacing={4} align="flex-start">
      {specialityList?.map((speciality: any) => (
        <VStack key={speciality.id} spacing={4} align="flex-start">
          <Heading size="sm">{speciality.name}</Heading>
          <Flex gap={2} flexWrap={"wrap"}>
            {speciality?.specialityTranscripts?.map((transcript: any) => {
              const transcriptData = transtripts?.find((item: any) => item.transcriptId === transcript.id);
              return (
                <CustomInputNumber
                  key={transcript.id}
                  label={transcript.nameVi}
                  value={transcriptData?.value ?? 0}
                  onChange={(value) => onChange(transcript.id, value)}
                  minW={"300px"}
                  maxW={"calc((100% - 20px) / 3)"}
                />
              );
            })}
          </Flex>
        </VStack>
      ))}
    </VStack>
  );
}

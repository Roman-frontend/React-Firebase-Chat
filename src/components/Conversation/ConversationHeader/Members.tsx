import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { StyledBadge } from "./ConversationHeaderStyles";
import { StyledBadgeWraper } from "../../Helpers/StyledBadge";
import { ChatContext } from "../../../Context/ChatContext";
import { DocumentData } from "firebase/firestore";
import { nanoid } from "nanoid";

interface IProps {
  activeChannel: DocumentData | undefined;
  setModalIsShowsMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Members(props: IProps) {
  const { activeChannel, setModalIsShowsMembers } = props;
  const { activeChannelId, allUsers, allChannels } = useContext(ChatContext);
  const [iconMembers, setIconMembers] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (allUsers && activeChannel) {
      createAvatars();
    }
  }, [activeChannelId, allUsers, activeChannel, allChannels]);

  const createAvatars = () => {
    let avatars: JSX.Element[] = [];
    activeChannel?.members.forEach((memberId: string) => {
      allUsers.forEach((user) => {
        if (user.uid === memberId) {
          const variantDot = user.online ? "dot" : "standard";
          avatars = avatars.concat(
            <StyledBadgeWraper
              variant={variantDot}
              key={nanoid()}
              name={user.name}
            />
          );
        }
      });
    });
    const readyIcons: JSX.Element = createAvatar(avatars);
    setIconMembers(readyIcons);
  };

  function createAvatar(avatars: JSX.Element[]) {
    return (
      <AvatarGroup
        max={3}
        style={{ fontSize: 30, cursor: "pointer", justifyContent: "flex-end" }}
        onClick={() => setModalIsShowsMembers(true)}
      >
        {avatars}
      </AvatarGroup>
    );
  }

  return iconMembers;
}

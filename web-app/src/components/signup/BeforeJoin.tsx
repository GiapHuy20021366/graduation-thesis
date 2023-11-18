import { Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { useLanguageContext } from "../../contexts";

interface IBeforeJoinProbs {
  setAccepted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BeforeJoin({ setAccepted }: IBeforeJoinProbs) {
  const navigate = useNavigate();
  const languageContext = useLanguageContext();
  const lang = languageContext.of(BeforeJoin);

  return (
    <Container>
      <img src="" alt="" />

      <Stack>
        <h1>{lang("title")}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
          praesentium dolores accusamus architecto, excepturi vitae repellendus
          explicabo consectetur provident facere a quas et similique sint qui
          accusantium nisi! Eveniet, nihil!
        </p>
      </Stack>
      <h3>{lang("agree-community")}:</h3>
      <Container>
        <Stack>
          <h4>1</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente
            reprehenderit itaque rem deleniti dignissimos ipsam, tempore alias
            quae ipsum dolorem eligendi veniam aliquam! Nostrum quia ut tenetur
            iste consequuntur saepe.
          </p>
        </Stack>
        <Stack>
          <h4>2</h4>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi
            voluptatem et quos cumque placeat, quaerat non doloremque quo, iure,
            repellendus similique debitis hic repudiandae porro soluta magnam
            dolore asperiores libero?
          </p>
        </Stack>
        <Stack>
          <h4>3</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            accusantium dignissimos ab veritatis sequi et rem quis reprehenderit
            quam tempore ipsam voluptas aperiam cupiditate, dolores molestiae?
            Possimus cum est cupiditate.
          </p>
        </Stack>
      </Container>

      <Stack>
        <Button onClick={() => setAccepted(true)}>
          {lang("i-agree")}
        </Button>
        <Button onClick={() => navigate("/")}>
          {lang("cancel-signup")}
        </Button>
      </Stack>
    </Container>
  );
}

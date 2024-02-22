import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

// function randomID(len) {
//     let result = '';
//     if (result) return result;
//     var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
//     maxPos = chars.length,
//     i;
//     len = len || 5;
//     for (i = 0; i < len; i++) {
//         result += chars.charAt(Math.floor(Math.random() * maxPos));
//     }
//     // console.log(result)
//     return result;
// }

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  var storedData = localStorage.getItem("user");
// Parse the stored data from JSON
var parsedData = JSON.parse(storedData);

// Access the user_id property
var userId = parsedData._id;
var userName = parsedData.user_id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentId, setdocumentId] = useState([]);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/patient-info/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          // Extract only the "Running" data
          setdocumentId(data._id);
        } else {
          setError(data.detail || "Failed to fetch patient information");
        }
      } catch (error) {
        setError("Error fetching patient information");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, [userId]);

  useEffect(() => {
    setdocumentId(documentId);
    console.log("UserId:", documentId);
  }, [documentId]);

  const navigate = useNavigate();
  const roomID = getUrlParams().get("roomID") || "documentId";

  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1455965454;
    const serverSecret = "c49644efc7346cc2a7a899aed401ad76";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      "documentId",
      "12345",
      "test123"
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      showPreJoinView: false,
      turnOnMicrophoneWhenJoining: false,
      turnOnCameraWhenJoining: false,
      showLeavingView: false,
      showLeaveRoomConfirmDialog: false,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
      onLeaveRoom: () => {
        // Navigate to home screen
        navigate("/profile");
        window.location.reload();
      },
    });

    // Log the URL alone
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?roomID=" +
      roomID;
    console.log("Shared URL:", url);
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";

export default function VideoCall() {

  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var user_Id = parsedData._id;
  var user_Name = parsedData.user_id;
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState(null);
  const [doctorId, setdoctorId] = useState(null);
  const [doctorName, setdoctorName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userId: "",
  });
  const zeroCloudInstance = useRef(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `https://api-backup-vap2.onrender.com/patient-info/${user_Id}`
        );
        const data = await response.json();

        if (response.ok) {
          setDocumentId(data._id);
          setdoctorId(data.doctor_id)
          setdoctorName(data.doctor_assigned)
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
  }, []);

  useEffect(() => {
    if (documentId && doctorId && doctorName) {
      init();
    }
  }, [documentId,doctorId,doctorName]);

  const init = async () => {
    setUserInfo({
      user_Name,
      user_Id,
    });
    const appID = 1455965454;
    const serverSecret = "c49644efc7346cc2a7a899aed401ad76";
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      documentId,
      user_Id,
      user_Name
    );
    zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);
    zeroCloudInstance.current.addPlugins({ ZIM });
    handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
  };

  const handleSend = (callType) => {
    const callee = doctorId;
    const calleeUsername = doctorName;
    zeroCloudInstance.current
      .sendCallInvitation({
        callees: [{ userID: callee, userName: calleeUsername }],
        callType: callType,
        timeout: 60,
      })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          alert("The user does not exist or is offline.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="myCallContainer" style={{ width: '100vw', height: '100vh' }}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
// handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
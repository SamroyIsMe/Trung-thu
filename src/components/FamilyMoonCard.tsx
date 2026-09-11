"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { TRUNG_THU_BACKGROUND } from "@/data/assets";

type Member = {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
};

const CARD_WIDTH = 1600;
const CARD_HEIGHT = 900;
const AVATAR_RATIO = 0.11;

function nextPosition(count: number) {
  const spots = [
    { x: 28, y: 46 },
    { x: 50, y: 40 },
    { x: 72, y: 46 },
    { x: 39, y: 62 },
    { x: 61, y: 62 },
    { x: 50, y: 74 },
  ];
  return spots[count % spots.length];
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function composeCard(
  backgroundSrc: string,
  members: Member[],
  message: string,
) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Không tạo được ảnh");

  const background = await loadImage(backgroundSrc);
  ctx.drawImage(background, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  const radius = CARD_WIDTH * AVATAR_RATIO;
  for (const member of members) {
    const photo = await loadImage(member.src);
    const x = (member.x / 100) * CARD_WIDTH;
    const y = (member.y / 100) * CARD_HEIGHT;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const size = Math.min(photo.width, photo.height);
    const sx = (photo.width - size) / 2;
    const sy = (photo.height - size) / 2;
    ctx.drawImage(photo, sx, sy, size, size, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#f6d36b";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.font = "bold 36px Be Vietnam Pro, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#1e2a4a";
    const labelY = y + radius + 48;
    const textWidth = ctx.measureText(member.name).width;
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fillRect(x - textWidth / 2 - 16, labelY - 34, textWidth + 32, 46);
    ctx.fillStyle = "#1e2a4a";
    ctx.fillText(member.name, x, labelY);
  }

  ctx.fillStyle = "rgba(20, 28, 56, 0.55)";
  ctx.fillRect(0, CARD_HEIGHT - 150, CARD_WIDTH, 150);
  ctx.fillStyle = "#fff8d6";
  ctx.font = "bold 42px Be Vietnam Pro, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Gửi ba mẹ — Trung Thu sum vầy", CARD_WIDTH / 2, CARD_HEIGHT - 88);
  ctx.font = "32px Be Vietnam Pro, sans-serif";
  ctx.fillStyle = "#ffffff";
  wrapText(ctx, message, CARD_WIDTH / 2, CARD_HEIGHT - 42, CARD_WIDTH - 160, 40);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Không xuất được ảnh"));
    }, "image/png");
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let drawY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, drawY);
      line = word;
      drawY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, drawY);
}

export default function FamilyMoonCard({ displayName }: { displayName: string }) {
  const [background, setBackground] = useState(TRUNG_THU_BACKGROUND);
  const [members, setMembers] = useState<Member[]>([]);
  const [message, setMessage] = useState(
    `${displayName} gửi ba mẹ ánh trăng đêm rằm. Con thương ba mẹ nhiều lắm.`,
  );
  const [status, setStatus] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function rememberUrl(url: string) {
    objectUrls.current.push(url);
    return url;
  }

  function addPhotos(files: FileList | null, presetName?: string) {
    if (!files?.length) return;
    const next = [...members];
    Array.from(files).forEach((file, index) => {
      const src = rememberUrl(URL.createObjectURL(file));
      const spot = nextPosition(next.length);
      next.push({
        id: crypto.randomUUID(),
        name: presetName && index === 0 ? presetName : file.name.replace(/\.[^.]+$/, ""),
        src,
        x: spot.x,
        y: spot.y,
      });
    });
    setMembers(next);
  }

  function changeBackground(file: File | null) {
    if (!file) return;
    setBackground(rememberUrl(URL.createObjectURL(file)));
  }

  function moveMember(id: string, clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.min(90, Math.max(10, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(78, Math.max(18, ((clientY - rect.top) / rect.height) * 100));
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, x, y } : member)),
    );
  }

  async function exportCard() {
    return composeCard(background, members, message);
  }

  async function downloadCard() {
    setStatus("Đang tạo ảnh...");
    const blob = await exportCard();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gui-ba-me-trung-thu.png";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Đã tải ảnh về máy.");
  }

  async function sendToParents() {
    setStatus("Đang chuẩn bị gửi ba mẹ...");
    const blob = await exportCard();
    const file = new File([blob], "gui-ba-me-trung-thu.png", { type: "image/png" });
    const shareData = {
      files: [file],
      title: "Gửi ba mẹ Trung Thu",
      text: message,
    };

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share(shareData);
      setStatus("Đã mở phần gửi cho ba mẹ.");
      return;
    }

    await downloadCard();
    setStatus("Máy này chưa gửi trực tiếp được. Ảnh đã tải về, hãy gửi Zalo/Messenger cho ba mẹ nhé.");
  }

  return (
    <Box className="mt-8 rounded-[28px] border border-orange-100 bg-[#fff8ee] p-5 sm:p-6">
      <Typography className="text-xs! font-extrabold! uppercase! tracking-widest! text-[#c45c12]!">
        Thiệp gửi ba mẹ
      </Typography>
      <Typography variant="h5" className="mt-1! font-extrabold!">
        Ghép ảnh gia đình lên đêm trăng
      </Typography>
      <Typography className="mt-1 text-slate-600">
        Thêm ảnh bạn và các thành viên, kéo để đặt vị trí trên nền Trung Thu, rồi gửi ba mẹ.
      </Typography>

      <Box
        ref={stageRef}
        className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-inner"
        onPointerMove={(event) => {
          if (!draggingId) return;
          moveMember(draggingId, event.clientX, event.clientY);
        }}
        onPointerUp={() => setDraggingId(null)}
        onPointerLeave={() => setDraggingId(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={background}
          alt="Nền Trung Thu"
          className="h-full w-full object-cover"
        />
        {members.map((member) => (
          <button
            key={member.id}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none"
            style={{ left: `${member.x}%`, top: `${member.y}%`, width: "18%" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDraggingId(member.id);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.src}
              alt={member.name}
              className="aspect-square w-full rounded-full border-4 border-[#f6d36b] object-cover shadow-lg"
            />
            <span className="mt-1 block truncate rounded-full bg-white/90 px-2 py-0.5 text-center text-xs font-bold text-slate-800">
              {member.name}
            </span>
          </button>
        ))}
      </Box>

      <Box className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button
          component="label"
          variant="contained"
          startIcon={<AddAPhotoRoundedIcon />}
          className="bg-[#ff9a3c]! hover:bg-[#f08a2a]!"
        >
          Thêm ảnh mình
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              addPhotos(event.target.files, displayName === "Bạn" ? "Con" : displayName);
              event.target.value = "";
            }}
          />
        </Button>
        <Button
          component="label"
          variant="contained"
          startIcon={<AddAPhotoRoundedIcon />}
          className="bg-[#8b74f0]! hover:bg-[#7459e6]!"
        >
          Thêm thành viên
          <input
            hidden
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              addPhotos(event.target.files);
              event.target.value = "";
            }}
          />
        </Button>
        <Button
          variant="outlined"
          onClick={() => setBackground(TRUNG_THU_BACKGROUND)}
        >
          Dùng nền Trung Thu
        </Button>
        <Button component="label" variant="outlined" startIcon={<ImageRoundedIcon />}>
          Đổi nền khác
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              changeBackground(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
        </Button>
      </Box>

      {members.length ? (
        <Box className="mt-4 space-y-2">
          {members.map((member) => (
            <Box key={member.id} className="flex items-center gap-2">
              <TextField
                size="small"
                value={member.name}
                onChange={(event) =>
                  setMembers((current) =>
                    current.map((item) =>
                      item.id === member.id ? { ...item, name: event.target.value } : item,
                    ),
                  )
                }
                fullWidth
              />
              <IconButton
                aria-label={`Xóa ${member.name}`}
                onClick={() =>
                  setMembers((current) => current.filter((item) => item.id !== member.id))
                }
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography className="mt-4 text-sm text-slate-500">
          Chưa có ảnh nào. Hãy thêm ảnh mình hoặc ba mẹ trước nhé.
        </Typography>
      )}

      <TextField
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        label="Lời nhắn gửi ba mẹ"
        fullWidth
        multiline
        minRows={2}
        className="mt-4!"
      />

      <Box className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="contained"
          startIcon={<SendRoundedIcon />}
          onClick={() => void sendToParents()}
          disabled={!members.length}
          className="bg-[#3ad07a]! hover:bg-[#2bb968]!"
        >
          Gửi ba mẹ
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadRoundedIcon />}
          onClick={() => void downloadCard()}
          disabled={!members.length}
        >
          Tải ảnh về máy
        </Button>
      </Box>
      {status ? (
        <Typography className="mt-2 text-sm text-slate-600">{status}</Typography>
      ) : null}
    </Box>
  );
}

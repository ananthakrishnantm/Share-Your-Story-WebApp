import Jimp from "jimp";

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F3FF33",
  "#33FFF5",
  "#F533FF",
  "#FF33A1",
  "#A133FF",
  "#33FF99",
  "#FF9933",
];

const generateProfilePicture = async (username) => {
  const imgSize = 100;

  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  const image = new Jimp(imgSize, imgSize, bgColor);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  const text = username[0].toUpperCase();
  const textWidth = Jimp.measureText(font, text);
  const textHeight = Jimp.measureTextHeight(font, text, imgSize);

  image.print(
    font,
    (imgSize - textWidth) / 2,
    (imgSize - textHeight) / 2,
    text
  );

  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

  return buffer;
};

export default generateProfilePicture;

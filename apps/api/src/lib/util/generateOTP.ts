const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const charactersLength = characters.length;

function generateOTP(length: number = 6): string {
  var result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default generateOTP;

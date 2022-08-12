module.exports = {


    SUCCESS : '성공',
    FAIL : '실패',

    JWS : {
        EXPIRE : '토큰이 만료되었습니다.',
        DISAGREEMENT : '토큰이 발급된 계정과 다릅니다.'
    },

    MAIL : {
        SUBJECT : '새로운 임시 비밀번호',
        CONTENT : function(pw) {
            let text = ``;
            text += `<!DOCTYPE html>`;
            text += `<html>`;
            text += `<body>`;
            text += `<div style="margin-left: 50px; max-width: 600px; padding-top: 50px;">`;
            text += `<table align="center" cellspacing="0" cellpadding="0" width="100%" style="border: 1px solid #D6D6D6; max-width: 600px;">`;
            text += `<tbody>`;
            text += `<tr>`;
            text += `<td style="background-color: #FFF; color: #444; font-size: 14px; line-height: 140%; padding: 25px 35px;">`;
            text += `<h1 style="font-size: 20px; font-weight: bold; line-height: 1.3; margin: 0 0 15px 0;">BYZANTIUM 비밀번호 재발급</h1>`;
            text += `<p style="margin: 0; padding: 0;">드래그로 임시 비밀번호를 확인 후</p>`;
            text += `<p style="margin: 0; padding: 0;">로그인 시 아래 임시 비밀번호를 입력하세요.</p>`;
            text += `</td>`;
            text += `</tr>`;
            text += `<tr>`;
            text += `<td style="background-color: #FFF; color: #444; font-size: 14px; line-height: 140%; padding: 25px 35px; padding-top: 0; text-align: center;">`;
            text += `<div style="color: #FFF; font-size: 36px; font-weight: bold; padding-bottom: 15px;">${pw}</div>`;
            text += `</td>`;
            text += `</tr>`;
            text += `</tbody>`;
            text += `</table>`;
            text += `</div>`;
            text += `</body>`;
            text += `</html>`;

            return text;
        }
    },

    ACCUONT : {
        ALREADY_EXIXT : '이미 가입된 계정입니다.',
        IS_NOT_MEMBER : '가입된 계정이 아닙니다.',
        DISAGREEMENT : '아이디/비밀번호를 확인하세요.'
    }

}
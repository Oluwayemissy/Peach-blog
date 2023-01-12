export const forgetPasswrd = data => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h5> Hi ${data.name} </h5>
    <b> ${data.resetCode} </b>
</body>
</html>
`;

export const checkCode = data => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h5> Hi ${data.name} </h5>
    <b> ${data.resetLink} </b>
</body>
</html>
`;

export const signUp = data => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h5> Hi ${data.first_name} </h5>
    <b> ${data.signLink} </b>
</body>
</html>
`;
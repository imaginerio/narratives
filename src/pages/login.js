import React from 'react';
import { Form, Button } from 'semantic-ui-react';

const Login = () => (
  <Form action="/admin/api/signin" method="POST">
    <Form.Input name="email" label="Email" type="email" />
    <Form.Input name="password" label="Password" type="password" />
    <Button type="submit">Submit</Button>
  </Form>
);

export default Login;

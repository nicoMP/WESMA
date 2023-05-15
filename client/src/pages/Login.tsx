import { connect } from 'react-redux';
import { loginUser } from '../actions/auth';
import { ChangeEvent, FormEvent, useState } from 'react';

type loginProps = {
  loginUser: VoidFunction;
}

function Login({ loginUser }: loginProps) {

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const { username, password } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser(username, password);
  }

  return (
    <div className="flex items-center justify-center h-screen w-full px-2">
      <div className="rounded-md shadow-lg py-4 w-96 border flex flex-col items-center">
        <h1 className="text-center text-violet-900 text-3xl mb-4 px-4">Login Required</h1>
        <div className="bg-slate-900 w-full text-white text-center p-4 mb-4">
          <h1 className="text-4xl font-bold">WESMA</h1>
        </div>
        <form onSubmit={e => onSubmit(e)} className="px-4 w-full mb-4">
          <div className="mb-2">
            <label htmlFor="">User ID</label>
            <input type="text" name="username" className="border border-black rounded-md p-1 text-sm w-full" value={username} onChange={e => onChange(e)} />
          </div>
          <div className="mb-4">
            <label htmlFor="">Password</label>
            <input type="password" name="password" className="border border-black rounded-md p-1 text-sm w-full" value={password} onChange={e => onChange(e)} />
          </div>
          <button type='submit' className="text-white bg-violet-900 p-2 w-full rounded-md">Login</button>
        </form>
        <div className="text-violet-800 text-xs underline">Forgot password?</div>
      </div>
    </div>
  )
}

export default connect(null, { loginUser })(Login);
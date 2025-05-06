import React from 'react'
import Authentication from './Authentication';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [showEye, setShowEye] = useState(true);
    const [form, setform] = useState({ site: "", username: "", password: ""})
    const [passwordArray, setpasswordArray] = useState([])
    const [signin, setsignin] = useState(false)

    useEffect (() => {
        const ak = localStorage.getItem("email");
        if(ak){ // log in kara do :
            setsignin(true);
            alert("log in successfully as "+ak);
            getPass();
        }
    }, [])
    const getPass = async()=>{
        let req = await fetch(`https://passop-v20-backend-production.up.railway.app/get-passwords?email=${localStorage.getItem("email")}`, {
            method: "GET"
        }); // using slug to send email :
        let passwords = await req.json();
        setpasswordArray(passwords);
    }

    const getPasswords = async (token) => {
        // verify token and get email and name :
        const ak = await fetch(`https://passop-v20-backend-production.up.railway.app/verify-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
        const bk = await ak.json();
        if (ak.status === 200) { // verified :
            console.log(bk); // You will get the payload(email and name)
            alert("Login Successfully, Welcome " + bk.name)
            localStorage.setItem("email",bk.email)
            // setform({ ...form, email: bk.email }); // ADDING EMAIL TO FORM :
            let req = await fetch(`https://passop-v20-backend-production.up.railway.app/get-passwords?email=${bk.email}`, {
                method: "GET"
            }); // using slug to send email :
            let passwords = await req.json();
            setpasswordArray(passwords); // assuming passwords are filtered by the user email on the server side
        } else {
            console.log('Token verification failed');
        }
    }

    const copyText = (text) => {
        alert("copied to clipboard")
        navigator.clipboard.writeText(text);
    }
    const eyeToggle = () => {
        setShowEye(!showEye)
    }
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const savePassword = async () => {
        if (form.site.length > 0 && form.username.length > 0 && form.password.length > 0) {
            if (signin) {
                if (form.id) {
                    // Update existing entry
                    await fetch(`https://passop-v20-backend-production.up.railway.app`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: form.id })
                    });
                    let iddd = uuidv4();
                    await fetch("https://passop-v20-backend-production.up.railway.app", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...form, id: iddd,email: localStorage.getItem("email") })
                    });
                    setpasswordArray([...passwordArray, { ...form, id: iddd,email: localStorage.getItem("email") }]);
                } else {
                    // Create new entry
                    let iddd = uuidv4();
                    await fetch("https://passop-v20-backend-production.up.railway.app", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...form, id: iddd,email: localStorage.getItem("email") })
                    });
                    setpasswordArray([...passwordArray, { ...form, id: iddd,email: localStorage.getItem("email") }]);
                }
                setform({ site: "", username: "", password: "" });
            }
            else { // not signIn :
                alert("Sign In with Google First !")
            }
        }
    }
    const deletePassword = async (id) => {
        let c = confirm("are you sure you want to delete this password ?")
        if (c) {
            setpasswordArray(passwordArray.filter(item => item.id != id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id != id)))
            let res = await fetch("https://passop-v20-backend-production.up.railway.app/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            })
        }
    }
    const editPassword = async (id) => {
        const obj = passwordArray.find(i => i.id == id); // object :
        console.log(obj);
        setform(obj); // now it will be displayed in the input fields :
        setpasswordArray(passwordArray.filter(item => item.id != id))
    }
    return (
        <>
            {/* Same as */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-green-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>
            <div className='relative'>
                <div className=' absolute right-0 p-5 max-md:static max-md:text-center'><Authentication getPasswords={getPasswords} setsignin={setsignin}/></div>
                <div className="container  w-[80vw] mx-auto p-2 flex flex-col gap-5 max-lg:w-[100vw]">
                    <div className="logo font-bold ml-5 text-center text-2xl">
                        <span className='text-green-500'>{'<'}</span>
                        <span className='text-black'>Pass</span>
                        <span className='text-green-500'>OP{'/>'}</span>
                    </div>
                    <div className='text-center font-bold'>
                        Your Own Password Manager
                    </div>
                    <form action="">
                        <input value={form.site} onChange={handleChange} name='site' className='w-full bg-white rounded-3xl p-1 px-3' type="text" placeholder='Enter Website URL' autoComplete="current-password" />
                        <div className='flex justify-center gap-2 relative mt-3'>
                            <input value={form.username} onChange={handleChange} name='username' className='bg-white rounded-3xl w-[90%] p-1 px-3 max-md:w-[50%]' type="text" placeholder='Enter Username' autoComplete="current-password" />
                            <div></div>
                            <input value={form.password} onChange={handleChange} name='password' className='bg-white rounded-3xl w-[40%] p-1 px-3 max-md:w-[50%]' type={showEye ? "password" : "text"} placeholder='Enter Password' autoComplete="current-password" />
                            <span className='absolute right-3 top-2 cursor-pointer' onClick={eyeToggle}>
                                {showEye ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </form>
                    <button onClick={savePassword} className='cursor-pointer bg-green-500 w-45 rounded-2xl m-auto p-2 px-4 flex items-center gap-2'>
                        <lord-icon
                            src="https://cdn.lordicon.com/efxgwrkc.json"
                            trigger="loop"
                            delay="2000">
                        </lord-icon>
                        <div className='text-sm'>Add Password</div>
                    </button>
                </div>
            </div>
            <div className="passwords w-[95vw] text-center m-auto pb-6 lg:w-[80vw]">
                <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                {passwordArray.length === 0 && <div> No passwords to show</div>}
                {passwordArray.length != 0 && <div className="max-md:text-[8px] overflow-x-auto">
                    <table className="table w-full m-auto rounded-md overflow-hidden mb-10">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <a href={`https://${item.site}`} target="_blank" rel="noopener noreferrer">
                                                {item.site}
                                            </a>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{item.username}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='justify-center py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>}
            </div>

        </>
    )
}

export default Manager

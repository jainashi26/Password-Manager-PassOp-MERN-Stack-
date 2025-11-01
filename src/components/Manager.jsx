import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/passwords")
            .then((res) => res.json())
            .then((data) => setPasswordArray(data))
            .catch((err) => console.error("Error fetching passwords:", err));
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const savePassword = () => {
        if (!form.site || !form.username || !form.password) {
            toast.warn("Please fill all fields!", { position: "top-right", theme: "dark" });
            return;
        }
        const newEntry = { ...form, id: uuidv4() };
        const updatedArray = [...passwordArray, newEntry];
        setPasswordArray(updatedArray);
        fetch("http://localhost:5000/api/passwords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
        })
            .then((res) => res.json())
            .then((data) => {
                setPasswordArray([...passwordArray, data]);
            })
            .catch((err) => console.error("Error saving password:", err));

        setForm({ site: "", username: "", password: "" });
        toast.success("Password Saved!", { position: "top-right", theme: "dark" });
    };

    const deletePassword = (id) => {
        let c = confirm("Do you really want to delete this password?");
        if (c) {
            fetch(`http://localhost:5000/api/passwords/${id}`, {
                method: "DELETE",
            })
                .then(() => {
                    setPasswordArray(passwordArray.filter((item) => item._id !== id));
                    toast.error("Password deleted!", { position: "top-right", theme: "dark" });
                })
                .catch((err) => console.error("Error deleting password:", err));

        }
    };

    const editPassword = (id) => {
        const selected = passwordArray.find((item) => item._id === id);
        if (!selected) return;

        setForm({
            site: selected.site,
            username: selected.username,
            password: selected.password,
        });

        const updatedPasswords = passwordArray.filter((item) => item._id !== id);
        setPasswordArray(updatedPasswords);
    };


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            theme: "dark",
        });
    };

    return (
        <>
            <ToastContainer />

            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-100 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size: 14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-200 opacity-20 blur-[100px]"></div>
            </div>

            <div className="mycontainer px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
                {/* Logo */}
                <h1 className="logo font-bold text-3xl sm:text-4xl text-center mt-4">
                    <span className="text-green-500">&lt;</span>
                    Pass
                    <span className="text-green-500">Op/&gt;</span>
                </h1>
                <p className="text-green-950 text-lg text-center mb-4">
                    Your own Password Manager
                </p>

                {/* Input Section */}
                <div className="text-black flex flex-col p-4 gap-4 sm:gap-6 items-center w-full max-w-lg mx-auto">
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                        className="rounded-full border border-green-500 w-full px-3 py-2 text-sm sm:text-base"
                        type="text"
                        name="site"
                    />

                    <div className="flex flex-col sm:flex-row justify-between w-full gap-3 sm:gap-4">
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            type="text"
                            name="username"
                            className="rounded-full border border-green-500 w-full px-3 py-2 text-sm sm:text-base"
                        />

                        <div className="flex items-center border border-green-500 rounded-full w-full px-3 py-2">
                            <input
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="flex-1 bg-transparent outline-none text-black text-sm sm:text-base"
                            />
                            <lord-icon
                                src={
                                    showPassword
                                        ? "https://cdn.lordicon.com/mrjuyheh.json"
                                        : "https://cdn.lordicon.com/dicvhxpz.json"
                                }
                                trigger="hover"
                                colors="primary:#16a34a"
                                style={{ width: "25px", height: "25px", cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            ></lord-icon>
                        </div>
                    </div>

                    <button
                        onClick={savePassword}
                        className="flex justify-center items-center gap-2 bg-green-500 rounded-full w-fit hover:bg-green-400 px-5 py-2 border border-green-950 text-sm sm:text-base"
                    >
                        <lord-icon src="https://cdn.lordicon.com/ueoydrft.json" trigger="hover"></lord-icon>
                        Save
                    </button>
                </div>

                {/* Saved Passwords */}
                <div className="passwords flex flex-col items-center mt-4 w-full">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">Your Passwords</h2>

                    {passwordArray.length === 0 && (
                        <div className="text-gray-600 text-sm sm:text-base">No Passwords to show</div>
                    )}

                    {passwordArray.length !== 0 && (
                        <div className="overflow-x-auto w-full max-w-4xl mx-auto">
                            <table className="table-auto min-w-full border border-green-700 text-center rounded-lg overflow-hidden shadow-md">
                                <thead className="bg-green-800 text-white">
                                    <tr>
                                        <th className="px-2 py-2 text-sm sm:text-base">Website</th>
                                        <th className="px-2 py-2 text-sm sm:text-base">Username</th>
                                        <th className="px-2 py-2 text-sm sm:text-base">Password</th>
                                        <th className="px-2 py-2 text-sm sm:text-base">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-green-200 text-green-900">
                                    {passwordArray.map((item, index) => (
                                        <tr key={index} className="border-t border-green-300">
                                            <td className="py-2">
                                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                    <span>{item.site}</span>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                        colors="primary:#16a34a"
                                                        style={{ width: "25px", height: "25px", cursor: "pointer" }}
                                                        onClick={() => copyToClipboard(item.site)}
                                                    ></lord-icon>
                                                </div>
                                            </td>
                                            <td className="py-2">
                                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                    <span>{item.username}</span>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                        colors="primary:#16a34a"
                                                        style={{ width: "25px", height: "25px", cursor: "pointer" }}
                                                        onClick={() => copyToClipboard(item.username)}
                                                    ></lord-icon>
                                                </div>
                                            </td>
                                            <td className="py-2">
                                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                    <span className="tracking-widest select-none">
                                                        {"•".repeat(item.password.length)}
                                                    </span>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                        colors="primary:#16a34a"
                                                        style={{ width: "25px", height: "25px", cursor: "pointer" }}
                                                        onClick={() => copyToClipboard(item.password)}
                                                    ></lord-icon>
                                                </div>
                                            </td>
                                            <td className="py-2 flex justify-center gap-4 sm:gap-6">
                                                <span className="edit" onClick={() => editPassword(item._id)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/exymduqj.json"
                                                        trigger="hover"
                                                        colors="primary:#16a34a"
                                                        style={{ width: "25px", height: "25px", cursor: "pointer" }}
                                                    ></lord-icon>
                                                </span>
                                                <span className="delete" onClick={() => deletePassword(item._id)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/jzinekkv.json"
                                                        trigger="hover"
                                                        colors="primary:#16a34a"
                                                        style={{ width: "25px", height: "25px", cursor: "pointer" }}
                                                    ></lord-icon>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setPasswordArray([]);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-full mt-3 hover:bg-red-500 text-sm sm:text-base"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </>
    );
};

export default Manager;


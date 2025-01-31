import React from 'react'

const Hero = () => {
    return (
        <section className="bg-black">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl text-sky-300 font-extrabold sm:text-5xl">
                        Write Together, Anywhere!
                    </h1>
                    <p className="mt-4 sm:text-xl/relaxed text-slate-300">
                        Transform ideas into stories with seamless real-time collaboration.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-black shadow hover:bg-slate-400 focus:outline-none sm:w-auto"
                            href="#"
                        >
                            Learn more
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
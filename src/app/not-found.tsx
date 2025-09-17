import Image from "next/image"
import Link from "next/link"

const page = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-5 relative overflow-hidden">
            <Image src="/404.svg" alt="" className="" width={400} height={215} />
            <div>
                <span className="block text-center text-(--Burgundy)">The page cannot be found. The requested</span>
                <span className="block text-center text-(--Burgundy)">URL was not found on this server.</span>
            </div>
            <Link href="/en" className="bg-gradient-to-b from-(--Burgundy) to-black px-10 py-2 rounded-3xl !text-white cursor-pointer">Return Home</Link>

            <>
                <svg className="absolute bottom-20 left-60" width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M96.0047 95.991H144C144 122.492 122.505 143.987 96.0047 143.987V95.991C96.0047 109.241 90.6344 121.25 81.9447 129.927C73.2685 138.616 61.2596 143.987 48.0092 143.987C34.7588 143.987 22.7498 138.616 14.0736 129.927C5.38399 121.25 0.0136719 109.241 0.0136719 95.991V47.9955C13.264 47.9955 25.273 53.3658 33.9492 62.0555C42.6389 70.7316 48.0092 82.7406 48.0092 95.991C48.0092 69.4903 69.5039 47.9955 96.0047 47.9955C69.5039 47.9955 48.0092 26.5007 48.0092 0H96.0047C122.505 0 144 21.4948 144 47.9955C144 74.4963 122.519 95.991 96.0047 95.991Z" fill="#4E0629" fill-opacity="0.2" />
                    <path d="M47.9955 0C47.9955 26.5007 26.5007 47.9955 0 47.9955V0H47.9955Z" fill="#4E0629" fill-opacity="0.2" />
                </svg>

                <svg className="absolute bottom-[50vh] left-20" width="85" height="85" viewBox="0 0 107 107" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_15_171)">
                        <path d="M50.3703 102.47L51.1203 56.7V12.65C51.1203 8.26 56.4603 6 59.5603 9.11L97.8203 47.48C100.92 50.59 98.7803 55.95 94.2903 55.95H60.6303C56.8903 55.95 54.9703 60.56 57.6403 63.24L99.7403 105.47C102.41 108.15 107.01 106.22 107.01 102.47V7.07C107.01 3.1 103.8 0 99.9603 0H4.74032C0.250321 0 -1.66968 4.61 1.75032 7.29L41.9303 47.59C45.0303 50.7 42.8903 56.06 38.4003 56.06H4.74032C0.250321 56.06 -1.66968 60.67 1.75032 63.35L43.8503 105.47C45.7703 108.15 50.3703 106.22 50.3703 102.47Z" fill="#4E0629" fill-opacity="0.2" />
                    </g>
                    <defs>
                        <clipPath id="clip0_15_171">
                            <rect width="107" height="106.72" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

                <svg className="absolute bottom-[50vh] -right-4" width="70" height="70" viewBox="0 0 88 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_15_198)">
                        <path d="M102.29 39.15C93.4804 30.34 79.2004 30.34 70.4004 39.15C79.2104 30.34 79.2104 16.06 70.4004 7.25999C65.9904 2.84999 60.2304 0.649985 54.4604 0.649985V0.609985L54.4404 0.649985C48.6704 0.649985 42.9004 2.84999 38.5004 7.25999C29.6904 16.07 29.6904 30.35 38.5004 39.15C29.6904 30.34 15.4104 30.34 6.61043 39.15C-2.19957 47.96 -2.19957 62.24 6.61043 71.04C15.4204 79.85 29.7004 79.85 38.5004 71.04L53.6604 55.88L47.0204 78.28L39.5904 109.5H69.3004L61.8704 78.28L55.2304 55.88L70.3904 71.04C79.2004 79.85 93.4804 79.85 102.28 71.04C111.09 62.23 111.09 47.95 102.28 39.15H102.29Z" fill="#4E0629" fill-opacity="0.2" />
                    </g>
                    <defs>
                        <clipPath id="clip0_15_198">
                            <rect width="108.89" height="108.89" fill="white" transform="translate(0 0.609985)" />
                        </clipPath>
                    </defs>
                </svg>

                <svg className="absolute top-20 right-60" width="80" height="80" viewBox="0 0 105 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_15_166)">
                        <path d="M77.37 0C77.37 13.86 66.14 25.09 52.28 25.09C38.42 25.09 27.19 13.86 27.19 0H0C0 28.87 23.41 52.28 52.28 52.28C81.15 52.28 104.56 28.87 104.56 0H77.37Z" fill="#4E0629" fill-opacity="0.2" />
                        <path d="M77.37 103.74C77.37 89.88 66.14 78.65 52.28 78.65C38.42 78.65 27.19 89.88 27.19 103.74H0C0 74.87 23.41 51.46 52.28 51.46C81.15 51.46 104.56 74.87 104.56 103.74H77.37Z" fill="#4E0629" fill-opacity="0.2" />
                    </g>
                    <defs>
                        <clipPath id="clip0_15_166">
                            <rect width="104.56" height="103.74" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

                <svg className="absolute bottom-14 right-48" width="90" height="90" viewBox="0 0 105 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_15_201)">
                        <path d="M105 35.0032V69.9968H70.0032V105H34.9968C34.9968 85.6663 19.3259 69.9968 0 69.9968V35.0032H34.9968V0H70.0032C70.0032 19.3337 85.6741 35.0032 105 35.0032Z" fill="#4E0629" fill-opacity="0.2" />
                    </g>
                    <defs>
                        <clipPath id="clip0_15_201">
                            <rect width="105" height="105" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

                <svg className="absolute -top-4 left-48" width="108" height="83" viewBox="0 0 108 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_15_160)">
                        <path d="M0.0997355 31.37L14.7597 81.15C15.3097 83.0201 17.6697 83.62 19.0497 82.24L42.8497 58.44C44.2297 57.06 43.6297 54.7201 41.7697 54.16L19.1497 47.36C17.2897 46.8 16.6997 44.45 18.0697 43.08L37.3597 23.79C38.0297 23.12 38.2797 22.14 38.0097 21.24L32.4297 2.52005C31.8697 0.650045 29.5197 0.0600435 28.1497 1.44004L0.749735 28.83C0.0797355 29.5 -0.160264 30.47 0.0997355 31.38V31.37Z" fill="#4E0629" fill-opacity="0.2" />
                        <path d="M53.5497 -16.27L4.05974 -30.89C2.09974 -31.47 0.279737 -29.64 0.869737 -27.68L11.0797 6.16002C11.6397 8.02002 13.9897 8.61002 15.3597 7.23002L30.9697 -8.40998C32.3397 -9.78998 34.6897 -9.19998 35.2497 -7.33998L43.6497 20.5C43.8997 21.33 44.5597 21.98 45.3897 22.23L63.8497 27.62C65.8097 28.19 67.6197 26.36 67.0297 24.41L55.2797 -14.54C55.0297 -15.37 54.3797 -16.02 53.5497 -16.26V-16.27Z" fill="#4E0629" fill-opacity="0.2" />
                        <path d="M71.5194 56.1001L106.309 21.3501C107.689 19.9701 107.089 17.6201 105.219 17.0601L71.3294 7.06006C69.3694 6.48006 67.5594 8.30006 68.1394 10.2601L74.5994 32.0901C75.1794 34.0401 73.3594 35.8601 71.4094 35.2901L44.0794 27.2201C43.1694 26.9501 42.1894 27.2001 41.5294 27.8701L28.6094 40.8701C27.2394 42.2501 27.8394 44.6001 29.7094 45.1501L68.9994 56.7401C69.8994 57.0101 70.8794 56.7601 71.5494 56.0901L71.5194 56.1001Z" fill="#4E0629" fill-opacity="0.2" />
                    </g>
                    <defs>
                        <clipPath id="clip0_15_160">
                            <rect width="107.07" height="114" fill="white" transform="translate(0 -31)" />
                        </clipPath>
                    </defs>
                </svg>
            </>
        </div>
    )
}

export default page
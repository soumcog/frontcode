const Footer = () => {
    return (
        <footer className="bg-white shadow-md mt-8">
            <div className="container mx-auto px-4 py-4 text-center">
                <p className="text-gray-600">
                    &copy; {new Date().getFullYear()} MicroTask App. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
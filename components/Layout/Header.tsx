import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { CalendarIcon, HomeIcon, NewspaperIcon } from "@heroicons/react/solid";

import { languages } from "@lib/options";

import NavItem from "@components/Nav/Item";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";

const Header = () => {
    const { language, onLanguageChange } = useHooks();
    return (
        <div className="sticky top-0 left-0 w-full">
            <Container background="bg-white" className="flex items-center gap-4 py-[11px]">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex gap-2">
                            <div className="flex w-8 items-center justify-center">
                                <Image src="/static/images/logo.png" width={48} height={36} />
                            </div>
                            <h3>AKSARA</h3>
                        </div>
                        <div className="flex gap-2">
                            <NavItem title="Home" link="/" icon={<HomeIcon className="h-5 w-5 text-black" />} />
                            <NavItem title="Articles" link="/articles" icon={<NewspaperIcon className="h-5 w-5 text-black" />} />
                            <NavItem title="Data Catalogue" link="/catalogue" icon={<NewspaperIcon className="h-5 w-5 text-black" />} />
                            <NavItem title="Data Release" link="/releases" icon={<CalendarIcon className="h-5 w-5 text-black" />} />
                        </div>
                    </div>
                    <Dropdown selected={language} setSelected={onLanguageChange} options={languages} />
                </div>
            </Container>
        </div>
    );
};

const useHooks = () => {
    const { pathname, asPath, query, locale, defaultLocale, push } = useRouter();
    const [language, setLanguage] = useState(languages.find(language => language.value === locale || language.value === defaultLocale));

    const onLanguageChange = (lang: any) => {
        push({ pathname, query }, asPath, {
            locale: lang.value,
        });
        setLanguage(lang);
    };

    return {
        language,
        onLanguageChange,
    };
};

export default Header;

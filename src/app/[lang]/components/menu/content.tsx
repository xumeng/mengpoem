"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Locale, type Dictionary } from "~/dictionaries";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { cn } from "~/utils";
import {
  Check,
  GithubIcon,
  Rows2,
  SendIcon,
  Tag,
  UserRound,
  MailIcon,
  NewspaperIcon,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Nav } from "~/components/ui/nav";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Link from "next/link";

export function Content({
  className,
  dict,
  lang,
}: {
  className?: string;
  dict: Dictionary;
  lang: Locale;
}) {
  const pathname = usePathname().replace(`/${lang}`, "");

  const { data: poemCount } = api.poem.count.useQuery();
  const { data: tagsCount } = api.tag.count.useQuery();
  const router = useRouter();

  const [style, setStyle] = useState("zinc");

  useEffect(() => {
    const style = localStorage.getItem("style") ?? "zinc";
    const body = document.body;
    body.classList.add(`theme-${style}`);
    body.setAttribute("data-theme", style);

    setStyle(style);
  }, []);

  return (
    <div className={cn(className)}>
      <Nav
        isCollapsed={false}
        links={[
          {
            title: dict.menu.poem,
            label: <span className="font-mono">{poemCount}</span>,
            icon: Rows2,
            variant:
              /^\/(poem|list)/.test(pathname) ||
              pathname === "" ||
              pathname === "/"
                ? "default"
                : "ghost",
            href: `/${lang}`,
          },
          {
            title: dict.menu.tag,
            icon: Tag,
            label: <span className="font-mono">{tagsCount?.[0]}</span>,
            variant: /^(\/tag)/.test(pathname) ? "default" : "ghost",
            href: `/${lang}/tag`,
          },
          {
            title: dict.menu.author,
            label: <span className="font-mono">{}</span>,
            icon: UserRound,
            variant: /^(\/author)/.test(pathname) ? "default" : "ghost",
            href: `/${lang}/author/1`,
          },
        ]}
      />
      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-f50 text-muted-foreground">{dict.menu.theme}</p>
      <div className="my-4 flex justify-between px-4">
        {["zinc", "rose", "blue", "green", "orange"].map((item) => (
          <Button
            key={item}
            variant={"default"}
            size={"icon"}
            aria-label={`${item} theme`}
            className={cn(
              `theme-${item}`,
              "rounded-full border-2 bg-transparent hover:bg-transparent",
              style === item ? "border-primary" : "border-transparent",
            )}
            onClick={() => {
              const body = document.body;
              body.classList.remove(`theme-${style}`);
              body.classList.add(`theme-${item}`);
              body.setAttribute("data-theme", item);

              setStyle(item);
              localStorage.setItem("style", item);
            }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              {item === style && <Check className="h-4 w-4" />}
            </div>
          </Button>
        ))}
      </div>
      <p className="px-4 text-f50 text-muted-foreground">
        {dict.menu.language}
      </p>
      <div className="my-4 px-4 text-f50">
        <Select
          value={lang}
          onValueChange={(value) => {
            localStorage.setItem("lang", value);
            router.replace(`/${value}/${pathname}`);
          }}
        >
          <SelectTrigger className="w-full" aria-label={dict.menu.language}>
            <SelectValue placeholder={dict.menu.language} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-Hans">中文简体</SelectItem>
            <SelectItem value="zh-Hant">中文繁体</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ko">한국어</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-f50">{dict.menu.contact}</p>
      <nav className="flex space-x-2 p-4">
        {[
          {
            title: "Blog",
            href: "https://amonxu.com",
            icon: <NewspaperIcon className="h-6 w-6" strokeWidth={1.5} />,
          },
          {
            title: "GitHub",
            href: "https://github.com/xumeng",
            icon: <GithubIcon className="h-6 w-6" strokeWidth={1.5} />,
          },
          {
            title: "Email",
            href: "mailto:gosuxm@gmail.com",
            icon: (
              <MailIcon
                className="h-6 w-6 text-destructive"
                strokeWidth={1.5}
              />
            ),
          },
        ].map(({ href, icon, title }) => (
          <Button
            key={href}
            size={"icon"}
            variant={"ghost"}
            aria-label={title}
            asChild
          >
            <Link
              aria-label={title}
              href={href}
              className="flex cursor-pointer justify-center"
            >
              {icon}
            </Link>
          </Button>
        ))}
      </nav>

      <div
        className="flex space-x-2 p-4 text-xs text-gray-400"
        style={{ position: "fixed", right: "0", bottom: "0" }}
      >
        {dict.menu.thank_desc}
        <Link
          aria-label="AsPoem 现代化诗词学习网站"
          title="AsPoem 现代化诗词学习网站"
          href="https://aspoem.com/"
          target="_blank"
          className="flex cursor-pointer font-semibold"
        >
          &nbsp; AsPoem
        </Link>
      </div>
    </div>
  );
}

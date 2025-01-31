import { navigateTo } from '@tarojs/taro';
import { Link as NextLink } from 'next/link';

export interface NavigationOptions {
  url: string;
  replace?: boolean;
}

export class UniversalNavigation {
  static navigate(options: NavigationOptions) {
    if (process.env.TARO_ENV) {
      navigateTo({
        url: options.url
      });
    } else {
      if (options.replace) {
        window.location.replace(options.url);
      } else {
        window.location.href = options.url;
      }
    }
  }
}

export const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  if (process.env.TARO_ENV) {
    return (
      <view onClick={() => UniversalNavigation.navigate({ url: href })}>
        {children}
      </view>
    );
  }
  return <NextLink href={href}>{children}</NextLink>;
};

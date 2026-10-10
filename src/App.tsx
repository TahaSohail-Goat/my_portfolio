import { lazy, Suspense } from "react";
import { Switch, Route, Router } from "wouter";
import { MotionProvider } from "@/components/studio/Motion";
import { Shell } from "@/components/studio/Shell";
import { SiteEntrance } from "@/components/studio/SiteEntrance";
import Home from "@/pages/Home";
const Work = lazy(() => import("@/pages/Work"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const About = lazy(() => import("@/pages/About"));
const Lab = lazy(() => import("@/pages/Lab"));
const Contact = lazy(() => import("@/pages/Contact"));
const Resume = lazy(() => import("@/pages/Resume"));
const NotFound = lazy(() => import("@/pages/not-found"));
export default function App() {
  return (
    <MotionProvider>
      <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <SiteEntrance>
          <Shell>
            <Suspense
              fallback={
                <div className="route-loading" role="status">
                  Opening the next chapter…
                </div>
              }
            >
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/work" component={Work} />
                <Route path="/work/:id">
                  {(params) => <ProjectDetail id={params.id} />}
                </Route>
                <Route path="/about" component={About} />
                <Route path="/lab" component={Lab} />
                <Route path="/contact" component={Contact} />
                <Route path="/resume" component={Resume} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Shell>
        </SiteEntrance>
      </Router>
    </MotionProvider>
  );
}
